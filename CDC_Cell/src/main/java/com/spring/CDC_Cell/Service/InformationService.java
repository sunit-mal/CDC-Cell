package com.spring.CDC_Cell.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.CDC_Cell.DAO.InformationRepo;
import com.spring.CDC_Cell.Model.Information;

@Service
public class InformationService {

	@Autowired
	private InformationRepo respository;

	// Basic Information
	public String updateBasicInformation(Information information) {
		if (information.getEmail() != null) {
			Information data = respository.findByEmail(information.getEmail());
			if (data == null) {
				respository.save(information);
			} else {

				if (information.getBatch() != null) {
					data.setBatch(information.getBatch());

				}
				if (information.getDept() != null) {
					data.setDept(information.getDept());
				}
				respository.save(data);
			}
			return "Done";

		} else
			return "Fail";
	}

	// Additional Information
	public String updateAdditionalInformation(Information information) {
		if (information.getEmail() != null) {
			Information data = respository.findByEmail(information.getEmail());
			if (data == null) {
				respository.save(information);
			} else {

				if (information.getGithub() != null) {
					data.setGithub(information.getGithub());
				}
				if (information.getLinkedin() != null) {
					data.setLinkedin(information.getLinkedin());
				}
				if (information.getNumber() != null) {
					data.setNumber(information.getNumber());
				}
				if (information.getSkill() != null) {
					data.setSkill(information.getSkill());
				}
				if (information.getProject() != null) {
					data.setProject(information.getProject());
				}
				respository.save(data);
			}
			return "Done";

		} else
			return "Fail";
	}

	public Information AllInformation(String email) {
		Information information = respository.findByEmail(email);
		return information;
	}

//	Search value pass
	public List<String> userNameSearch() {
		List<Information> allData = respository.findAll();
		List<String> filterValue = new ArrayList<>();
		
		for (Information data : allData) {
			filterValue.add(data.getEmail());
		}
		return filterValue;
	}
}





















