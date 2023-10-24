package com.spring.CDC_Cell.Controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spring.CDC_Cell.DTO.AllSetOfRequestBody;
import com.spring.CDC_Cell.DTO.ApplicentInformation;
import com.spring.CDC_Cell.Mapper.ApplicentMapper;
import com.spring.CDC_Cell.Model.Information;
import com.spring.CDC_Cell.Payload.FileResponce;
import com.spring.CDC_Cell.Service.FileService;
import com.spring.CDC_Cell.Service.InformationService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/basicimformation")
public class BasicInformationUpdate {

	@Autowired
	private FileService service;

	@Autowired
	private InformationService informationService;

	@Autowired
	private ApplicentMapper mapper;

	@Value("${project.file}")
	private String path;

	@PostMapping("/upload/{username}")
	public ResponseEntity<FileResponce> uploadCv(@RequestParam("cv") MultipartFile file,
			@PathVariable String username) {
		String massage;

		try {
			massage = service.uploadCV(path, file, username);
		} catch (IOException e) {
			return new ResponseEntity<>(new FileResponce(null, "Server Error"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		if (massage == "already exits") {
			return new ResponseEntity<>(new FileResponce(massage, "Image Already exists"), HttpStatus.BAD_REQUEST);
		} else {
			return new ResponseEntity<>(new FileResponce(massage, "CV SucessFully Uploaded"), HttpStatus.OK);
		}
	}

	@GetMapping("/cv/{username}")
	public ResponseEntity<FileResponce> checkCV(@PathVariable String username) {

		String CreateFileName = username.replace(".", "_");
		String fileNameString = CreateFileName + ".pdf";
		String fullpath = path + File.separator + fileNameString;
		boolean status = service.fileExistingCheck(fullpath);
		if (status) {
			return new ResponseEntity<>(new FileResponce(fileNameString, "CV Present"), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new FileResponce(null, "CV didn't existis"), HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping(value = "/pdf/{username}", produces = MediaType.APPLICATION_PDF_VALUE)
	public ResponseEntity<Resource> servePdf(@PathVariable String username) throws IOException {

		String CreateFileName = username.replace(".", "_");
		String fileName = CreateFileName + ".pdf";
		Path pdfPath = Paths.get(path).resolve(fileName); // Assuming the 'pdfs' directory is in the project's root
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

//	For basic information
	@PostMapping("/basicData")
	public ResponseEntity<String> updateBasicInformation(@RequestBody Information information) {
		String massage = informationService.updateBasicInformation(information);
		if (massage == "Done") {
			return new ResponseEntity<>("Sucessfully Update", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Email not valid", HttpStatus.BAD_REQUEST);
		}
	}

//	For Additional information
	@PostMapping("/additionalData")
	public ResponseEntity<Map<String, String>> updateAdditionalInformation(@RequestBody Information information) {
		String massage = informationService.updateAdditionalInformation(information);
		if (massage == "Done") {
			Map<String, String> responce = new HashMap<>();
			responce.put("massage", "Sucessfully Update");
			return new ResponseEntity<>(responce, HttpStatus.OK);
		} else {
			Map<String, String> responce = new HashMap<>();
			responce.put("massage", "Email not valid");
			return new ResponseEntity<>(responce, HttpStatus.BAD_REQUEST);
		}
	}

//	Fetch Information
	@GetMapping("/all/{email}")
	public ResponseEntity<Information> getAllInformation(@PathVariable String email) {
		Information information = informationService.AllInformation(email);
		if (information != null) {
			return new ResponseEntity<Information>(information, HttpStatus.OK);
		} else {
			return new ResponseEntity<Information>(information, HttpStatus.NOT_FOUND);
		}
	}

//	Fetch Search values
	@GetMapping("/searchItems")
	public ResponseEntity<List<String>> searchUserName(HttpServletRequest request) {
		List<String> filter = informationService.userNameSearch();
		return new ResponseEntity<List<String>>(filter, HttpStatus.OK);

	}

	@PostMapping("/fetchInformationForJobApplication")
	public ResponseEntity<List<ApplicentInformation>> fetchInformationForJobApplication(
			@RequestBody List<AllSetOfRequestBody> requestData) {

		List<ApplicentInformation> responseData = new ArrayList<>();
		for (AllSetOfRequestBody allSetOfRequestBody : requestData) {
			String username = allSetOfRequestBody.getRequestDataString();
			String email = username.substring(1, username.length() - 1);
			Information information = informationService.AllInformation(email);
			if (information != null) {
				ApplicentInformation data = mapper.toApplicentInformation(information);
				String CreateFileName = email.replace(".", "_");
				String fileNameString = CreateFileName + ".pdf";
				String fullpath = path + File.separator + fileNameString;
				boolean status = service.fileExistingCheck(fullpath);
				if (status) {
					data.setCv(fullpath);
				} else {
					data.setCv("Not Avalable");
				}
				responseData.add(data);
			}
		}
		return new ResponseEntity<>(responseData, HttpStatus.OK);
	}

}
