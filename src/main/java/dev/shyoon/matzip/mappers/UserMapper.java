package dev.shyoon.matzip.mappers;

import dev.shyoon.matzip.entities.RegisterContactCodeEntity;
import dev.shyoon.matzip.entities.RegisterEmailCodeEntity;
import dev.shyoon.matzip.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    UserEntity selectUserByContact(@Param(value = "contact") String contact);
    UserEntity selectUserByEmail(@Param(value = "email")String email);
    UserEntity selectUserByNickname(@Param(value = "nickname")String nickname);

    RegisterEmailCodeEntity selectRegisterEmailCodeByEmailCodeSalt(RegisterEmailCodeEntity registerEmailCode);


    int insertRegisterContactCode(RegisterContactCodeEntity registerContactCode);
    int insertRegisterEmailCode(RegisterEmailCodeEntity registerEmailCode);
    int insertUser(UserEntity user);

    int updateRegisterCode(RegisterContactCodeEntity registerContactCodeEntity);
    int updateRegisterEmailCode(RegisterEmailCodeEntity registerEmailCode);
    int updateUser(UserEntity user);

    RegisterContactCodeEntity selectRegisterContactCodeByContactSalt(RegisterContactCodeEntity registerContactCodeEntity);

}
