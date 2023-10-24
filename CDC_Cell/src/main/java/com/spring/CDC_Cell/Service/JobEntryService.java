package com.spring.CDC_Cell.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.spring.CDC_Cell.DAO.JobDataRepo;
import com.spring.CDC_Cell.Model.JobEntry;

@Service
public class JobEntryService {

	@Autowired
	private JobDataRepo jobRepo;

	public JobEntry AddJobEntity(JobEntry data) {
		LocalDate today = LocalDate.now();
		data.setEntryDate(today);
		data.setApplicentList(null);
		JobEntry entryValue = jobRepo.save(data);
		return entryValue;
	}

	public JobEntry getJob(long id) {
		@SuppressWarnings("deprecation")
		JobEntry data = jobRepo.getById(id);
		return data;
	}

	public List<JobEntry> getJobsByDate(LocalDate date) {
		List<JobEntry> information = new ArrayList<>();
		List<JobEntry> data = jobRepo.getByEntryDate(date);
		information.addAll(data);
		int i = 7;
		while (i != 0) {
			LocalDate newDate = date.minusDays(i);
			List<JobEntry> temp = jobRepo.getByEntryDate(newDate);
			information.addAll(temp);
			i--;
		}
		return information;
	}

	public List<JobEntry> getAllJob() {
		List<JobEntry> information = jobRepo.findAll();
		return information;
	}

	public void Applied(long id, String userName) {
		@SuppressWarnings("deprecation")
		JobEntry jobDetails = jobRepo.getById(id);
		List<String> applicent = jobDetails.getApplicentList();
		if (applicent != null) {
			applicent.add(userName);
		} else {
			applicent = new ArrayList<>();
			applicent.add(userName);
		}
		jobDetails.setApplicentList(applicent);
		jobRepo.save(jobDetails);
	}

	public String uploadJobDescription(String path, MultipartFile file) throws IOException {

		String name = file.getOriginalFilename();
		String uuid = UUID.randomUUID().toString();
		String newFileName = uuid.concat(name.substring(name.lastIndexOf(".")));
		String filePath = path + File.separator + newFileName;
		File f = new File(path);
		if (!f.exists()) {
			f.mkdir();
		}
		File existingFile = new File(filePath);
		if (existingFile.exists()) {
			existingFile.delete();
		}
		Files.copy(file.getInputStream(), Paths.get(filePath));
		return newFileName;
	}

	public String deleteJobDetails(long id, String path) {
		@SuppressWarnings("deprecation")
		JobEntry data = jobRepo.getById(id);
		String filename = data.getMoreDetails();
		if (filename == null) {
			jobRepo.delete(data);
			return "Process Done";
		}
		
		String fullPath = path + File.separator + filename;
		Path filePath = Paths.get(fullPath);
		try {
			if (Files.deleteIfExists(filePath)) {
				jobRepo.delete(data);
				return "Process Done";
			}
		} catch (IOException e) {
			System.out.println(e);
		}
		return "Precess fail";
	}
}
