package dev.shyoon.matzip.mappers;

import dev.shyoon.matzip.entities.RegisterContactCodeEntity;
import dev.shyoon.matzip.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    UserEntity selectUserByContact(@Param(value = "contact") String contact);
    int insertRegisterContactCode(RegisterContactCodeEntity registerContactCode);
}
