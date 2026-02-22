const db = require('../config/db');

exports.postJob = async (req, res) => {
    // 1. Destructure data match with your Frontend & SQL needs
    const { title, location, job_type, salary_range, category, description, requirements, last_date } = req.body;
    const userId = req.user.id; 

    try {
        // 2. Prothome Recruiters table theke ashol ID khuje ber kora
        // Apnar SQL-e recruiters table-e user_id column ache
        const [recruiter] = await db.promise().execute('SELECT id, company_name FROM recruiters WHERE user_id = ?', [userId]);

        if (!recruiter || recruiter.length === 0) {
            return res.status(403).json({ 
                success: false, 
                msg: "Vaiya, apnar recruiter profile setup kora nai! Age profile create koren." 
            });
        }

        const rId = recruiter[0].id;
        const cName = recruiter[0].company_name; // SQL table-e company_name lagbe

        // 3. Insert Query (Column name gula apnar SQL table er sathe match kora hoyeche)
        // Note: SQL-e last_date ar requirements column nai, tai description er sathe merge kora hoyeche ba ignore kora hoyeche
        const sql = `INSERT INTO jobs 
            (recruiter_id, job_title, company_name, job_description, country, salary_range, job_type, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`;
        
        // Requirements ar Deadline ke description er moddhe dhukiye dilam jeno database-e thake
        const fullDescription = `${description} \n\nRequirements: ${requirements} \nDeadline: ${last_date}`;
        
        const values = [
            rId, 
            title, 
            cName, 
            fullDescription, 
            location, // Country column-e location pathachhi
            salary_range, 
            job_type.toLowerCase(), // SQL enum: 'remote', 'on-site', 'hybrid'
        ];

        await db.promise().execute(sql, values);

        res.status(201).json({ success: true, msg: "Job Posted Successfully! 🚀" });

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ success: false, msg: "Server Error: " + err.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id; 

        // 1. Recruiter Profile
        const [recruiter] = await db.execute('SELECT * FROM recruiters WHERE user_id = ?', [userId]);
        if (recruiter.length === 0) return res.status(404).json({ msg: "Profile not found" });
        const rId = recruiter[0].id;

        // 2. Stats Calculation
        // Live Vacancies & Total Talents
        const [jobs] = await db.execute('SELECT COUNT(*) as count FROM jobs WHERE recruiter_id = ? AND status = "active"', [rId]);
        const [apps] = await db.execute('SELECT COUNT(*) as count FROM job_applications ja JOIN jobs j ON ja.job_id = j.id WHERE j.recruiter_id = ?', [rId]);
        const [short] = await db.execute('SELECT COUNT(*) as count FROM job_applications ja JOIN jobs j ON ja.job_id = j.id WHERE j.recruiter_id = ? AND ja.status = "shortlisted"', [rId]);

        // Hire Velocity Logic: Average days from application to shortlist
        const [velocity] = await db.execute(
            `SELECT AVG(DATEDIFF(application_date, created_at)) as avg_days FROM job_applications ja 
             JOIN jobs j ON ja.job_id = j.id WHERE j.recruiter_id = ?`, [rId]
        );

        // Goal Tracking: Suppose target is 20 applicants per month
        const target = 20;
        const progress = Math.min(Math.round((apps[0].count / target) * 100), 100);

        // Recent Jobs with Applicant Count
        const [recent] = await db.execute(
            `SELECT j.*, (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) as app_count 
             FROM jobs j WHERE recruiter_id = ? ORDER BY id DESC LIMIT 3`, [rId]
        );

        res.json({
            company: recruiter[0],
            stats: {
                liveVacancies: jobs[0].count,
                totalTalents: apps[0].count,
                shortlisted: short[0].count,
                hireRate: velocity[0].avg_days ? `${Math.abs(Math.round(velocity[0].avg_days))} Days` : "N/A"
            },
            goal: { progress, target, current: apps[0].count },
            recentJobs: recent
        });
    } catch (err) { res.status(500).send("Server Error"); }
};