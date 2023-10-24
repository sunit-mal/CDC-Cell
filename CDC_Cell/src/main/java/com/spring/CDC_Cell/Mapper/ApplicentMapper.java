package com.spring.CDC_Cell.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.spring.CDC_Cell.DTO.ApplicentInformation;
import com.spring.CDC_Cell.Model.Information;

@Mapper(componentModel = "spring")
public interface ApplicentMapper {

	@Mapping(target = "cv", ignore = true)
	ApplicentInformation toApplicentInformation(Information info);
	
	@Mapping(target = "id", ignore = true)
	Information toInformation(ApplicentInformation dtoIfo);
}
