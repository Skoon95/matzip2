const recoverForm = document.getElementById("recoverForm");
recoverForm.warning = recoverForm.querySelector('[rel="warning"]');
recoverForm.warning.show = (text) => {
    recoverForm.warning.innerText = text;
    recoverForm.warning.classList.add('visible');
};

recoverForm['cancel'].onclick = () => {
    recoverForm.querySelectorAll('input[type="radio"]')[0].checked = true;
    recoverForm['eContact'].value = '';
    recoverForm['eContact'].removeAttribute('disabled');
    recoverForm['eContactSend'].removeAttribute('disabled')
    recoverForm['eContactCode'].value = '';
    recoverForm['eContactCode'].setAttribute('disabled', 'disabled');
    recoverForm['eContactVerify'].setAttribute('disabled', 'disabled');
    recoverForm['eContactSalt'].value = '';
    recoverForm['pEmail'].value = '';
    recoverForm.hide();
    coverElement.hide();
}

recoverForm.onsubmit = e => {
    e.preventDefault();
    if (recoverForm['option'].value === 'email') {
        //이메일
        if (recoverForm['eContactSalt'].value === '') {
            recoverForm.warning.show('연락처 인증을 완료해 주세요.');
            return;
        }
    }
    if (recoverForm['option'].value === 'password') {
        //비밀번호
        if (recoverForm['pEmail'].value === '') {
            recoverForm.warning.show('이메일 주소를 입력해 주세요.');
            recoverForm['pEmail'].focus();
            return;
        }
    }
};

recoverForm['eContactSend'].addEventListener('click', () => {
    recoverForm.warning.hide();
    if (recoverForm['eContact'].value = '') {
        recoverForm.warning.show('연락처를 입력해주세요');
        recoverForm['eContact'].focus();
        return;
    }
        if (!new RegExp('^(010)(\\d{8})$').test(recoverForm['eContact'].value)) {
            recoverForm.warning.show('올바른 번호를 입력해주세요');
            recoverForm['eContact'].focus();
            recoverForm['eContact'].select();
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `user/contactCodeRec?eContact=${recoverForm['eContact'].value}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseObject = JSON.parse(xhr.responseText);
                    switch (responseObject.result){
                        case 'failure':
                            recoverForm.warning.show('해당 연락처는 이미 사용중입니다.');
                            recoverForm['eContact'].focus();
                            recoverForm['eContact'].select();
                            break;
                        case 'success':
                            recoverForm['eContact'].setAttribute('disabled', 'disabled');
                            recoverForm['eContactSend'].setAttribute('disabled', 'disabled');
                            recoverForm['eContactCode'].removeAttribute('disabled');
                            recoverForm['eContactVerify'].removeAttribute('disabled');
                            recoverForm['eContactCode'].focus();
                            recoverForm['eContactSalt'].value = responseObject.salt;
                            recoverForm.warning.show('입력하신 연락처로 인증번호를 전송하였습니다. 5분 이내로 입력해 주세요');
                            break;
                        default:
                            recoverForm.warning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 다시 시도해 주세요.');
                    }
                } else {
                    recoverForm.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            }
        };
        xhr.send();
});

recoverForm['eContactVerify'].addEventListener('click',()=>{
   recoverForm.warning.hide();
   if (recoverForm['eContactCode'].value===''){
       recoverForm.warning.show('인증번호를 입력해 주세요.');
       recoverForm['eContactCode'].focus();
       recoverForm['eContactCode'].select();
       return;
   }
   if (!new RegExp('^(\\d{6})$').test(recoverForm['eContactCode'].value)){
       recoverForm.warning.show('올바른 인증번호를 입력해주세요');
       recoverForm['eContactCode'].focus();
       recoverForm['eContactCode'].select();
       return;;
   }
   const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', recoverForm['eContact'].value);
    formData.append('salt', recoverForm['eContactSalt'].value);
    formData.append('code', recoverForm['eContactCode'].value);
   xhr.open('PATCH','/user/contactCodeRec');
   xhr.onreadystatechange = () => {
     if (xhr.readyState === XMLHttpRequest.DONE){
        if (xhr.status >= 200 && xhr.status <300) {
            const responseObject = JSON.parse(xhr.responseText);
            switch (responseObject.result){
                case 'failure_expired':
                    recoverForm.warning.show('해당 인증번호는 만료되었습니다. 처음부터 다시 진행해 주세요');
                    recoverForm['eContact'].removeAttribute('disabled');
                    recoverForm['eContactSend'].removeAttribute('disabled');
                    recoverForm['eContactCode'].setAttribute('disabled', 'disabled');
                    recoverForm['eContactVerify'].setAttribute('disabled', 'disabled');
                    break;
                case 'success':
                    recoverForm['eContactCode'].setAttribute('disabled', 'disabled');
                    recoverForm['eContactVerify'].setAttribute('disabled', 'disabled');
                    recoverForm.warning.show('인증이 완료되었습니다');
                    break;
                default:
                    recoverForm['eContactCode'].focus();
                    recoverForm['eContactCode'].select();
                    recoverForm.warning.show('인증번호가 올바르지 않습니다. 다시 확인해 주세요');
            }
        } else {
            recoverForm.warning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해주세요.');
        }
      }
    };
    xhr.send(formData);
});

