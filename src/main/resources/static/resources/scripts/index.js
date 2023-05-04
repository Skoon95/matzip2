const listElement = document.getElementById('list');
listElement.addressGu = listElement.querySelector('[rel="addressGu"]');
listElement.addressDong = listElement.querySelector('[rel="addressDong"]');

const mapElement = document.getElementById('map');
mapElement.geocoder = new kakao.maps.services.Geocoder();
mapElement.init = (params) => {
    mapElement.object = new kakao.maps.Map(mapElement, {
        center: new kakao.maps.LatLng(params.latitude, params.longitude),
        level: params.level
    });
    ['dragend', 'zoom_changed'].forEach(event => kakao.maps.event.addListener(mapElement.object, event, () => {
        const center = mapElement.object.getCenter();
        mapElement.savePosition({
            latitude: center.Ma,
            longitude: center.La,
            level: mapElement.object.getLevel()
        });
        mapElement.geocoder.coord2Address(center.La, center.Ma, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                console.log(result);
                listElement.addressGu.innerText = result[0]['address']['region_2depth_name'];
                listElement.addressDong.innerText = result[0]['address']['region_3depth_name'];
            }
        });
    }));
}

mapElement.savePosition = (params) => {
    localStorage.setItem('latitude', params.latitude);
    localStorage.setItem('longitude', params.longitude);
    localStorage.setItem('level', params.level);
};

const loadingElement = document.getElementById('loading');
loadingElement.show = () => loadingElement.classList.add('visible');
loadingElement.hide = () => loadingElement.classList.remove('visible');
const coverElement = document.getElementById('cover');
coverElement.show = (f) => {
    coverElement.classList.add('visible');
    coverElement.onclick = f;
}
coverElement.hide = () => {
    coverElement.classList.remove('visible');
    coverElement.onclick = undefined;
}

const loginForm = document.getElementById('loginForm');
loginForm.emailWarning = loginForm.querySelector('[rel="emailWarning"]');
loginForm.emailWarning.show = (text) => {
    loginForm.emailWarning.innerText = text;
    loginForm.emailWarning.classList.add('visible');
};
loginForm.emailWarning.hide = () => loginForm.emailWarning.classList.remove('visible');
loginForm.passwordWarning = loginForm.querySelector('[rel="passwordWarning"]');
loginForm.passwordWarning.show = (text) => {
    loginForm.passwordWarning.innerText = text;
    loginForm.passwordWarning.classList.add('visible');
};
loginForm.passwordWarning.hide = () => loginForm.passwordWarning.classList.remove('visible');
loginForm.show = () => {
    loginForm['email'].classList.remove('_invalid');
    loginForm.emailWarning.hide();
    loginForm['password'].classList.remove('_invalid');
    loginForm.passwordWarning.hide();
    loginForm.loginWarning.hide();
    loginForm['email'].value = '';
    loginForm['email'].focus();
    loginForm['password'].value = '';
    loginForm.classList.add('visible');

};
loginForm.loginWarning = loginForm.querySelector('[rel="loginWarning"]');
loginForm.loginWarning.show = (text) => {
    loginForm.loginWarning.innerText = text;
    loginForm.loginWarning.classList.add('visible');
};
loginForm.loginWarning.hide = () => loginForm.loginWarning.classList.remove('visible');

loginForm.hide = () => {
    loginForm.classList.remove('visible');
}
loginForm.onsubmit = e => {
    e.preventDefault();

    if (loginForm['email'].value === '') {
        loginForm['email'].classList.add('_invalid');
        loginForm['email'].focus();
        loginForm.emailWarning.show('이메일을 입력해 주세요.');
        return false;
    }
    if (loginForm['password'].value === '') {
        loginForm['password'].classList.add('_invalid');
        loginForm['password'].focus();
        loginForm.passwordWarning.show('비밀번호를 입력해주세요.');
        return false;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', loginForm['email'].value);
    formData.append('password', loginForm['password'].value);
    xhr.open('POST', '/user/login');
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status >= 200 && xhr.status < 300) {
            const responseObject = JSON.parse(xhr.responseText);
            switch (responseObject.result) {
                case 'failure':
                    loginForm.loginWarning.show('이메일 혹은 비밀번호가 올바르지 않습니다.');
                    loginForm['email'].focus();
                    loginForm['email'].select();
                    break;
                case 'success':
                    location.href += '';
                    break;
                case 'suspended':
                    loginForm.loginWarning.show('해당 계정은 이용이 정지된 계정입니다. 관리자에게 문의해주세요.');
                    break;
                default:
                    loginForm.loginWarning.show('서버가 알 수 없는 응답을 반환했습니다. 관리자에게 문의해 주세요')
            }
        } else {
            loginForm.loginWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        }
    };
    xhr.send(formData);
};

const registerForm = document.getElementById('registerForm');
registerForm.termWarning = registerForm.querySelector('[rel="termWarning"]');
registerForm.termWarning.show = (text) => {
    registerForm.termWarning.innerText = text;
    registerForm.termWarning.classList.add('visible');
};
registerForm.termWarning.hide = () => registerForm.termWarning.classList.remove('visible');

registerForm.contactWarning = registerForm.querySelector('[rel="contactWarning"]');
registerForm.contactWarning.show = (text) => {
    registerForm.contactWarning.innerText = text;
    registerForm.contactWarning.classList.add('visible');
};
registerForm.contactWarning.hide = () => registerForm.contactWarning.classList.remove('visible');

registerForm.show = () => {
    registerForm.classList.remove('step-1', 'step-2', 'step-3');
    registerForm.classList.add('step-1', 'visible');
};
registerForm.hide = () => {
    registerForm.classList.remove('step-1', 'step-2', 'step-3', 'visible');
    registerForm['agreeServiceTerm'].checked = false;
    registerForm['agreePrivacyTerm'].checked = false;
    registerForm.termWarning.hide();
};
registerForm.onsubmit = e => {
    e.preventDefault();
    if (registerForm.classList.contains('step-1')) {
        registerForm.termWarning.hide();
        if (!registerForm['agreeServiceTerm'].checked) {
            registerForm.termWarning.show('서비스 이용약관을 읽고 동의해 주세요.');
            return false;
        }
        if (!registerForm['agreePrivacyTerm'].checked) {
            registerForm.termWarning.show('개인정보 처리방침을 읽고 동의해 주세요.');
            return false;
        }
        registerForm.classList.remove('step-1');
        registerForm.classList.add('step-2');
    } else if (registerForm.classList.contains('step-2')) {
        registerForm.classList.remove('step-2');
        registerForm.classList.add('step-3');
    }
};
registerForm['contactSend'].addEventListener('click', () => {
    registerForm.contactWarning.hide();
    if (registerForm['contact'].value === '') {
        registerForm.contactWarning.show('연락처를 입력해 주세요');
        registerForm['contact'].focus();
        return
    }
    if (!new RegExp('^(010)(\\d{8})$').test(registerForm['contact'].value)) {
        registerForm.contactWarning.show('올바른 번호를 입력해 주세요');
        registerForm['contact'].focus();
        registerForm['contact'].select();
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/contactCode?contact=${registerForm['contact'].value}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result){
                    case 'failure_duplicate':
                        registerForm.contactWarning.show('해당 연락처는 이미 사용중입니다.');
                        registerForm['contact'].focus();
                        registerForm['contact'].select();
                        break;
                    case 'success':
                        registerForm['contact'].setAttribute('disabled','disabled');
                        registerForm['contactSend'].setAttribute('disabled','disabled');
                        registerForm['contactCode'].removeAttribute('disabled');
                        registerForm['contactVerify'].removeAttribute('disabled');
                        registerForm['contactCode'].focus();
                        registerForm['contactSalt'].value= responseObject.salt;
                        registerForm.contactWarning.show('입력하신 연락처로 인증번호를 전송하였습니다. 5분 이내로 입력해 주세요');
                        break;
                    default:
                        registerForm.contactWarning.show('서버가 알 수 없는 응답을 반환했습니다. 잠시 후 다시 시도해주세요.');
                }
            } else {
                registerForm.contactWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요');
            }
        }
    };
    xhr.send();
});


const methods = {
    hideLogin: (x, e) => {
        coverElement.hide();
        loginForm.hide();
    },
    hideRegister: (x, e) => {
        coverElement.hide();
        registerForm.hide();
    },
    showLogin: (x, e) => {
        coverElement.show(() => {
            coverElement.hide();
            loginForm.hide();
        });
        loginForm.show();
    },
    showRegister: (x, e) => {
        coverElement.show(() => {
            coverElement.hide();
            registerForm.hide();
        });
        loginForm.hide();
        registerForm.show();
    },
    logout: (x, e) => {
        alert('로그아웃 해야함');
    }
};

document.body.querySelectorAll('[data-method]').forEach(x => {
    if (typeof methods[x.dataset.method] === 'function') {
        x.addEventListener('click', e => {
            methods[x.dataset.method](x, e);
        });
    }
});


window.addEventListener('load', () => {
    loadingElement.hide();
});

if (localStorage.getItem('latitude') &&
    localStorage.getItem('longitude') &&
    localStorage.getItem('level')) {
    mapElement.init({
        latitude: parseFloat(localStorage.getItem('latitude')),
        longitude: parseFloat(localStorage.getItem('longitude')),
        level: parseInt(localStorage.getItem('level'))
    });
} else {
    navigator.geolocation.getCurrentPosition(e => {
        mapElement.init({
            latitude: e.coords.latitude,
            longitude: e.coords.longitude,
            level: 3
        });
    }, () => {
        mapElement.init({
            latitude: 35.8715411,
            longitude: 128.601505,
            level: 3
        });
    });
}

