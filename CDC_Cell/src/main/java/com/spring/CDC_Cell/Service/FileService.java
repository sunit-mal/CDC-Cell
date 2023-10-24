package com.spring.CDC_Cell.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

	public String uploadImage(String path, MultipartFile file, String fileName) throws IOException {

		// extract file name
		String name = file.getOriginalFilename();

		// Create Random file name
		String CreateFileName = fileName.replace(".", "_");
		String newFileName = CreateFileName.concat(name.substring(name.lastIndexOf(".")));

		// Create full path
		String filePath = path + File.separator + newFileName;

		// Create folder if not created
		File f = new File(path);
		if (!f.exists()) {
			f.mkdir();
		}

		File existingFile = new File(filePath);
		if (existingFile.exists()) {
			return "already exits";
		}

		Files.copy(file.getInputStream(), Paths.get(filePath));
		return "Store Sucessfully";

	}

	public boolean deleteImage(String file) {
		Path filePath = Paths.get(file);

		int maxAttempts = 3; // Number of times to retry
		int attempts = 0;

		while (attempts < maxAttempts) {
			try {
				if (Files.deleteIfExists(filePath)) {
					return true;
				}
			} catch (IOException e) {
				System.out.println(e);
				attempts++;
			}
		}
		return false;
	}

	public FileInputStream getProfilePic(String path, String fileName) throws FileNotFoundException {
		String fullPath = path + File.separator + fileName;
		FileInputStream media = new FileInputStream(fullPath);
		return media;
	}

//	For CV

	public String uploadCV(String path, MultipartFile file, String fileName) throws IOException {

		// extract file name
		String name = file.getOriginalFilename();

		// Create Random file name
		String CreateFileName = fileName.replace(".", "_");
		String newFileName = CreateFileName.concat(name.substring(name.lastIndexOf(".")));

		// Create full path
		String filePath = path + File.separator + newFileName;

		// Create folder if not created
		File f = new File(path);
		if (!f.exists()) {
			f.mkdir();
		}

		File existingFile = new File(filePath);
		if (existingFile.exists()) {
			existingFile.delete();
		}

		Files.copy(file.getInputStream(), Paths.get(filePath));
		return "Store Sucessfully";

	}

	public boolean fileExistingCheck(String filePath) {
		File existingFile = new File(filePath);
		if (existingFile.exists()) {
			return true;
		} else {
			return false;
		}

	}
}
