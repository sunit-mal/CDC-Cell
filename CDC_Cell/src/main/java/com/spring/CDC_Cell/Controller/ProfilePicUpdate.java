package com.spring.CDC_Cell.Controller;

import java.io.File;
//import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
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
//import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spring.CDC_Cell.Payload.FileResponce;
import com.spring.CDC_Cell.Service.FileService;

//import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/")
public class ProfilePicUpdate {

	@Autowired
	private FileService service;

	@Value("${project.image}")
	private String path;

//	@PostMapping(value="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PostMapping(value = "/upload/{fileName}")
	public ResponseEntity<FileResponce> fileUpload(@RequestParam("image") MultipartFile image,
			@PathVariable String fileName) {

		String massage;

		try {
			massage = service.uploadImage(path, image, fileName);
		} catch (IOException e) {
			return new ResponseEntity<>(new FileResponce(null, "Server Error"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		if (massage == "already exits") {
			return new ResponseEntity<>(new FileResponce(massage, "Image Already exists"), HttpStatus.BAD_REQUEST);
		} else {
			return new ResponseEntity<>(new FileResponce(massage, "Image SucessFully Uploaded"), HttpStatus.OK);
		}
	}

	@GetMapping(value = "/ProfilePic/{username}", produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<Resource> servePdf(@PathVariable String username) throws IOException {
		String CreateFileName = username.replace(".", "_");
		String fileName = CreateFileName + ".jpg"; // Update file extension to .jpg
		Path jpgPath = Paths.get(path).resolve(fileName); // Assuming the 'jpgs' directory is in the project's root
															// folder

		Resource jpgResource = new UrlResource(jpgPath.toUri());

		if (jpgResource.exists() && jpgResource.isReadable()) {
			HttpHeaders headers = new HttpHeaders();
			headers.add(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE); // Update content type to JPEG
			return ResponseEntity.ok().headers(headers).body(jpgResource);
		} else {
			// Handle the case where the JPG file doesn't exist or isn't readable
			return ResponseEntity.notFound().build();
		}
	}

//	@GetMapping(value = "/getThosePic")
//	public ResponseEntity<List<Resource>> getSetOfPics() {
//	    List<String> usernames = new ArrayList<>();
//	    usernames.add("sunitmal1832002@gmail.com");
//	    usernames.add("secretguider7122@gmail.com");
//
//	    List<Resource> imageResources = new ArrayList<>();
//
//	    for (String username : usernames) {
//	        String createFileName = username.replace(".", "_");
//	        String fileName = createFileName + ".jpg"; // Update file extension to .jpg
//	        Path jpgPath = Paths.get(path).resolve(fileName); // Assuming the 'jpgs' directory is in the project's root
//
//	        try {
//	            Resource file1Resource = new UrlResource(jpgPath.toUri());
//
//	            imageResources.add(file1Resource);
//
//	        } catch (IOException e) {
//	            // Handle exceptions appropriately
//	            e.printStackTrace();
//	        }
//	    }
//	    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(imageResources);
//	}



	@DeleteMapping("/delete/{username}")
	public ResponseEntity<FileResponce> deleteExistingFile(@PathVariable String username) throws IOException {

		String CreateFileName = username.replace(".", "_");
		String fileNameString = CreateFileName + ".jpg";
		String fullPath = path + File.separator + fileNameString;
		boolean status = service.deleteImage(fullPath);
		if (status) {
			return new ResponseEntity<>(new FileResponce(null, "Image SucessFully Deleted"), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new FileResponce(null, "Delete Process fail"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		}
	}
}
