package com.spring.CDC_Cell.Controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spring.CDC_Cell.DAO.JobDataRepo;
import com.spring.CDC_Cell.Model.JobEntry;
import com.spring.CDC_Cell.Payload.FileResponce;
import com.spring.CDC_Cell.Service.JobEntryService;

@RestController
@RequestMapping("/job")
public class JobController {

	@Autowired
	private JobEntryService Jobservice;

	@Autowired
	private JobDataRepo jobRepo;

	@Value("${project.file_JD}")
	private String path;

	@PostMapping("/register")
	public ResponseEntity<JobEntry> jobRegister(@RequestBody JobEntry information) {
		try {
			JobEntry resturnValue = Jobservice.AddJobEntity(information);
			return new ResponseEntity<JobEntry>(resturnValue, HttpStatus.CREATED);
		} catch (Exception e) {
			JobEntry nullData = new JobEntry(0, null, null, null, null, null, null);
			return new ResponseEntity<JobEntry>(nullData, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/byDate/{date}")
	public ResponseEntity<List<JobEntry>> resentJob(@PathVariable LocalDate date) {
		List<JobEntry> responceValue = Jobservice.getJobsByDate(date);
		return new ResponseEntity<List<JobEntry>>(responceValue, HttpStatus.OK);
	}

	@GetMapping("/all")
	public ResponseEntity<List<JobEntry>> getAllJob() {
		List<JobEntry> responceValue = Jobservice.getAllJob();
		return new ResponseEntity<List<JobEntry>>(responceValue, HttpStatus.OK);
	}

	@PostMapping("/apply/{id}")
	public ResponseEntity<String> application(@RequestBody String username, @PathVariable long id) {
		String newApplicent = username.substring(13, username.length() - 2);
		Jobservice.Applied(id, newApplicent);
		return new ResponseEntity<>("Application send", HttpStatus.OK);
	}

	@PostMapping("/upload")
	public ResponseEntity<FileResponce> jobDescriptionUpload(@RequestParam("jd") MultipartFile file) {
		String massage;

		try {
			massage = Jobservice.uploadJobDescription(path, file);
		} catch (IOException e) {
			return new ResponseEntity<>(new FileResponce(null, "Server Error"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(new FileResponce(massage, "File SucessFully Uploaded"), HttpStatus.OK);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleleteJob(@PathVariable long id) {
		String massage = Jobservice.deleteJobDetails(id, path);
		if (massage == "Process Done") {
			return new ResponseEntity<>(massage, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(massage, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
	public ResponseEntity<Resource> servePdf(@PathVariable String id) throws IOException {

		long JobId = Long.valueOf(id);

		@SuppressWarnings("deprecation")
		String FileName = jobRepo.getById(JobId).getMoreDetails();
		Path pdfPath = Paths.get(path).resolve(FileName); // Assuming the 'pdfs' directory is in the project's root
															// folder

		Resource pdfResource = new UrlResource(pdfPath.toUri());

		if (pdfResource.exists() && pdfResource.isReadable()) {
			HttpHeaders headers = new HttpHeaders();
			headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);
			return ResponseEntity.ok().headers(headers).body(pdfResource);
		} else {
			// Handle the case where the PDF file doesn't exist or isn't readable
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/getjob/{id}")
	public ResponseEntity<List<String>> getJobById(@PathVariable String id) {
		long JobId = Long.valueOf(id);
		JobEntry data = Jobservice.getJob(JobId);
		List<String> respose = new ArrayList<>();
		respose.addAll(data.getApplicentList());
		return new ResponseEntity<List<String>>(respose, HttpStatus.OK);
	}

}
