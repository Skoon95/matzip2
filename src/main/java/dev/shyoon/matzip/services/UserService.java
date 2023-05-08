package dev.shyoon.matzip.services;

import dev.shyoon.matzip.entities.RegisterContactCodeEntity;
import dev.shyoon.matzip.entities.UserEntity;
import dev.shyoon.matzip.enums.CheckEmailResult;
import dev.shyoon.matzip.enums.CheckNicknameResult;
import dev.shyoon.matzip.enums.SendRegisterContactCodeResult;
import dev.shyoon.matzip.enums.VerifyRegisterContactCodeResult;
import dev.shyoon.matzip.mappers.UserMapper;
import dev.shyoon.matzip.utils.CryptoUtil;
import dev.shyoon.matzip.utils.NCloudUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserService {
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public SendRegisterContactCodeResult sendRegisterContactCode(RegisterContactCodeEntity registerContactCode) {
        if (registerContactCode == null
                || registerContactCode.getContact() == null
                || !registerContactCode.getContact().matches("^(010)(\\d{8})$")) {
            return SendRegisterContactCodeResult.FAILURE;
        }
        if (this.userMapper.selectUserByContact(registerContactCode.getContact()) !=null){
            return SendRegisterContactCodeResult.FAILURE_DUPLICATE;
        }
        String code = RandomStringUtils.randomNumeric(6);
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                registerContactCode.getCode(),
                code,
                Math.random(),
                Math.random()));
        Date createdAt = new Date();
        Date expiresAt = DateUtils.addMinutes(createdAt,5);
        registerContactCode.setCode(code).setSalt(salt).setCreatedAt(createdAt).setExpiresAt(expiresAt).setExpired(false);
        NCloudUtil.sendSms(registerContactCode.getContact(), String.format("[맛집 회원가입] 인증번호 [%s]를 입력해주세요",registerContactCode.getCode()));

        return this.userMapper.insertRegisterContactCode(registerContactCode)>0
                ? SendRegisterContactCodeResult.SUCCESS
                : SendRegisterContactCodeResult.FAILURE;

    }

//    public SendContactVerify sendRegisterContactVerify(RegisterContactCodeEntity registerContactCodeEntity){
//        RegisterContactCodeEntity registerContactCode = this.userMapper.selectContactVerify(registerContactCodeEntity.getContact(),registerContactCodeEntity.getCode(),registerContactCodeEntity.getSalt());
//        Date now = new Date();
//        if (registerContactCode == null){
//            return SendContactVerify.FAILURE;
//        }
//        if (now.compareTo(registerContactCode.getExpiresAt())>0){
//            return SendContactVerify.FAILURE_EXPIRED;
//        }
//        registerContactCode.setExpired(true);
//        return this.userMapper.updateRegisterCode(registerContactCode)>0
//                ? SendContactVerify.SUCCESS
//                : SendContactVerify.FAILURE;
//    }

    public VerifyRegisterContactCodeResult verifyRegisterContactCodeResult(RegisterContactCodeEntity registerContactCode){
        registerContactCode = this.userMapper.selectRegisterContactCodeByContactSalt(registerContactCode);
        if (registerContactCode == null){
            return VerifyRegisterContactCodeResult.FAILURE;
        }
        if (new Date().compareTo(registerContactCode.getExpiresAt())>0){
            return VerifyRegisterContactCodeResult.FAILURE_EXPIRED;
        }
        registerContactCode.setExpired(true);
        return this.userMapper.updateRegisterCode(registerContactCode)>0
                ? VerifyRegisterContactCodeResult.SUCCESS
                : VerifyRegisterContactCodeResult.FAILURE;


    }

    public CheckEmailResult checkEmailResult(String email){
        return this.userMapper.selectUserByEmail(email)==null
                ? CheckEmailResult.OKAY
                : CheckEmailResult.DUPLICATE;
    }

    public CheckNicknameResult checkNicknameResult(String nickname){
        return this.userMapper.selectUserByNickname(nickname)==null
                ? CheckNicknameResult.OKAY
                : CheckNicknameResult.DUPLICATE;
    }

}