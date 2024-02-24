const express = require('express');
const router = express.Router();
var passport = require('passport');
const flash = require('connect-flash');
router.use(flash());
const prisma = require('../lib/prisma.js');
const multer = require('multer');
const { Storage } = require("@google-cloud/storage");
const bcrypt = require('bcrypt');

const storage = new Storage({
    projectId: 'referess',
    keyFilename: './referess.json',
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // limit to 5MB
    },
});

router.post('/upload/documents', upload.any(), async (req, res) => {
    if (!req.files) {
        res.status(400).send('No file uploaded.');
        return;
    }
    const bucketName = 'referess.appspot.com';
    const files = req.files;
    let urls = [];
    for (let i = 0; i < files.length; i++) {
        const blob = storage.bucket(bucketName).file("documents/" + files[i].originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: files[i].mimetype,
            },
        });

        blobStream.on('error', err => {
            console.error(err);
            res.status(500).send(err);
        });

        blobStream.on('finish', async () => {
            // Make the file public
            await blob.makePublic();

            // Construct the file URL
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            urls.push(publicUrl);
            if (urls.length === files.length) {
                res.status(200).send({ message: 'Files uploaded.', urls });
            }
        });

        blobStream.end(files[i].buffer);
    }
});

router.post('/upload', upload.single("file"), async (req, res) => {
    const { type } = req.query;
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    const bucketName = 'referess.appspot.com';
    let blob;
    switch (type) {
        case "avatar":
            blob = storage.bucket(bucketName).file("avatars/" + req.file.originalname);
            break;
        case "resume":
            blob = storage.bucket(bucketName).file("resumes/" + req.file.originalname);
            break;
        default:
            res.status(400).send('Invalid file type.');
            return;
    }
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    blobStream.on('error', err => {
        console.error(err);
        res.status(500).send(err);
    });

    blobStream.on('finish', async () => {
        // Make the file public
        await blob.makePublic();

        // Construct the file URL
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

        res.status(200).send({ message: 'File uploaded.', url: publicUrl });
    });

    blobStream.end(req.file.buffer);
});

// TODO - Add a route to handle Registration
router.post('/register', async (req, res) => {
    const {
        email,
        fullname,
        password,
        avatar,
        phone,
        type,
        // Candidate
        job_title,
        description,
        speciality,
        employment_type,
        experience,
        location,
        resume,
        skills,
        // Referee
        company,
        position,
        department,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            return res.status(400).json({
                error: true,
                message: "User already exists",
            });
        }

        let data;
        if (type === "CANDIADATE") {
            data = await prisma.user.create({
                data: {
                    email,
                    fullname,
                    password: hashedPassword,
                    avatar,
                    phone,
                    type,
                    candidate: {
                        create: {
                            job_title,
                            description,
                            speciality,
                            employment_type,
                            experience,
                            location,
                            resume,
                            skills,
                        }
                    }
                }
            });
        } else if (type === "REFEREES") {
            data = await prisma.user.create({
                data: {
                    email,
                    fullname,
                    password: hashedPassword,
                    avatar,
                    phone,
                    type,
                    referee: {
                        create: {
                            company,
                            position,
                            department,
                        }

                    }
                }
            });
        }
        res.status(200).json({
            error: false,
            message: "Successfully Registered",
            user: data,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true,
            message: "Failed to register",
            error: error,
        });
    }
});

// Login using local strategy
router.post('/login', passport.authenticate('local', {
    failureFlash: true // Enable flash messages for authentication failures
}), (req, res) => {
    if (req.user.Error) {
        res.status(401).json({ error: true, message: req.user.Error });
    } else if (req.user && !req.user.Error) {
        // Authentication successful
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        });
    }
});

router.put('/edit', (req, res) => {
    const {
        id,
        email,
        fullname,
        password,
        avatar,
        phone,
        type,
        // Candidate
        job_title,
        description,
        speciality,
        employment_type,
        experience,
        location,
        resume,
        skills,
        // Referee
        company,
        position,
        department,
    } = req.body;

    if (!id) {
        return res.status(400).json({
            error: true,
            message: "User ID is required",
        });
    } else {
        prisma.user.update({
            where: { id: id },
            data: {
                email,
                fullname,
                password,
                avatar,
                phone,
                type,
                candidate: {
                    update: {
                        job_title,
                        description,
                        speciality,
                        employment_type,
                        experience,
                        location,
                        resume,
                        skills,
                    }
                },
                referee: {
                    update: {
                        company,
                        position,
                        department,
                    }
                }
            }
        }).then((data) => {
            res.status(200).json({
                error: false,
                message: "Successfully Updated",
                user: data,
            });
        }).catch((error) => {
            res.status(500).json({
                error: true,
                message: "Failed to update",
                error: error,
            });
        });
    }
});

router.get('/getAlluser', async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            candidate: true,
            referee: true,
        }
    });
    res.status(200).json(users);
});


router.post('/getUser', async (req, res) => {
    const { userID, receiverID } = req.body;

    if (!userID || !receiverID) {
        res.status(400).json({ error: true, message: "User ID and receiver user ID must be provided" });
    }
    let user;
    let receiver;
    try {
        user = await prisma.user.findUnique({
            where: {
                id: userID
            },
            include: {
                candidate: true,
                referee: true,
            }
        });
        receiver = await prisma.user.findUnique({
            where: {
                id: receiverID
            },
            include: {
                candidate: true,
                referee: true,
            }
        });
        res.status(200).json({ user, receiver });
    } catch (error) {
        console.log(error.message);
    }


});


router.post('/getUsersBytype', async (req, res) => {
    const { type } = req.body;
    if (!type) {
        return res.status(400).json({ error: true, message: "User type must be provided and either REFEREES OR CANDIDATE" });
    }

    const getUsers = async (type) => {
        const users = await prisma.user.findMany({
            where: {
                type: type
            },
            include: {
                candidate: true,
                referee: true,
            }
        });
        return users;
    }

    switch (type) {
        case "REFEREES":
            const referees = await getUsers("CANDIADATE");
            res.status(200).json(referees);
            break;
        case "CANDIADATE":
            const candidates = await getUsers("REFEREES");
            res.status(200).json(candidates);
            break;
        default:
            return res.status(400).json({ error: true, message: "Invalid user type" });
            break;
    }

});




router.get('/getReferee', async (req, res) => {
    const users = await prisma.user.findMany
        ({
            where: {
                type: "REFEREES"
            },
            include: {
                referee: true
            }
        });
    res.status(200).json(users);
});

router.get('/getCandidate', async (req, res) => {
    const users = await prisma.user.findMany
        ({
            where: {
                type: "CANDIADATE"
            },
            include: {
                candidate: true
            }
        });
    res.status(200).json(users);
});
const LocalAuth = router
module.exports = router;