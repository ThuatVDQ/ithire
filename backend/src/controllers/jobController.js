const Job = require("../models/Job");
const User = require("../models/User");
const Company = require("../models/Company");
const Address = require("../models/Address");
const Skill = require("../models/Skill");
const JobAddress = require("../models/JobAddress");
const JobSkill = require("../models/JobSkill");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      slots,
      type,
      experience,
      position,
      level,
      currency,
      salary_start,
      salary_end,
      requirement,
      benefit,
      deadline,
      category_id,
      skills,
      addresses
    } = req.body;

    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });

    const company = await Company.findOne({ created_by: user.user_id });
    
    if (!user || !company) {
      return res.status(404).json({ message: "User or associated company not found" });
    }

    if (user.role_id !== 2) {
      return res.status(403).json({ message: "Access denied. Only recruiters can create jobs." });
    }

    const newJob = new Job({
      title,
      description,
      slots,
      type,
      experience,
      position,
      level,
      currency,
      salary_start,
      salary_end,
      requirement,
      benefit,
      deadline,
      apply_number: 0,
      like_number: 0,
      views: 0,
      status: "PENDING",
      company_id: company.company_id,
      category_id,
    });

    await newJob.save();

    for (const skillName of skills) {
      let skill = await Skill.findOne({ name: skillName });
      if (!skill) {
        skill = new Skill({ name: skillName });
        await skill.save();
      }
      const jobSkill = new JobSkill({
        job_id: newJob.job_id,
        skill_id: skill.skill_id,
      });
      await jobSkill.save();
    }

    for (const addressData of addresses) {
      const { city, country, district, street } = addressData;
      let address = await Address.findOne({ city, country, district, street });
      if (!address) {
        address = new Address({ city, country, district, street });
        await address.save();
      }
      const jobAddress = new JobAddress({
        job_id: newJob.job_id,
        address_id: address.address_id,
      });
      await jobAddress.save();
    }

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobDetail = async (req, res) => {
  try {
    const { job_id } = req.params;

    // Tìm Job theo job_id
    const job = await Job.findOne({ job_id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Tìm Company liên kết với Job
    const company = await Company.findOne({ company_id: job.company_id });

    // Tìm các Skill liên kết với Job
    const jobSkills = await JobSkill.find({ job_id: job.job_id });
    const skills = await Skill.find({ skill_id: { $in: jobSkills.map(js => js.skill_id) } });

    // Tìm các Address liên kết với Job
    const jobAddresses = await JobAddress.find({ job_id: job.job_id });
    const addresses = await Address.find({ address_id: { $in: jobAddresses.map(ja => ja.address_id) } });

    // Trả về thông tin chi tiết của Job cùng với Company, Skills và Addresses
    res.status(200).json({
      job,
      company,
      skills,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching job detail:", error);
    res.status(500).json({ message: "Server error" });
  }
};
