package dev.shyoon.matzip.mappers;

import dev.shyoon.matzip.entities.RegisterContactCodeEntity;
import dev.shyoon.matzip.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    UserEntity selectUserByContact(@Param(value = "contact") String contact);
    UserEntity selectUserByEmail(@Param(value = "email")String email);
    UserEntity selectUserByNickname(@Param(value = "nickname")String nickname);


    int insertRegisterContactCode(RegisterContactCodeEntity registerContactCode);
    int updateRegisterCode(RegisterContactCodeEntity registerContactCodeEntity);



    RegisterContactCodeEntity selectRegisterContactCodeByContactSalt(RegisterContactCodeEntity registerContactCodeEntity);

}
