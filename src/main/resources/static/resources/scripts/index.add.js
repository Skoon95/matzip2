const addForm = document.getElementById('addForm');
const addMatzip = document.getElementById('addMatzip');

addForm.thumbnailPreview=addForm.querySelector('[rel="thumbnailPreview"]');
addForm.emptyThumbnail = addForm.querySelector('[rel="emptyThumbnail"]');


addForm.show = function () {
    const center = mapElement.object.getCenter();
    addForm['lat'].value = center.Ma;
    addForm['lng'].value = center.La;
    mapElement.geocoder.coord2Address(center.La, center.Ma, (result, status) => {
        addForm['addressPrimary'].value = status === kakao.maps.services.Status.OK
            ? result[0]['address']['address_name']
            : '';
    });


    addForm['name'].value = '';
    addForm['contactFirst'].value = '';
    addForm['contactSecond'].value = '';
    addForm['contactThird'].value = '';
    addForm['description'].value = '';
    addForm['addressSecondary'].value = '';
    addForm['thumbnail'].value = '';
    addForm['opSun'].checked = true;
    addForm['openSun'].value = '';
    addForm['closeSun'].value = '';
    addForm['opMon'].checked = true;
    addForm['openMon'].value = '';
    addForm['closeMon'].value = '';
    addForm['opTue'].checked = true;
    addForm['openTue'].value = '';
    addForm['closeTue'].value = '';
    addForm['opWed'].checked = true;
    addForm['openWed'].value = '';
    addForm['closeWed'].value = '';
    addForm['opThu'].checked = true;
    addForm['openThu'].value = '';
    addForm['closeThu'].value = '';
    addForm['opFri'].checked = true;
    addForm['openFri'].value = '';
    addForm['closeFri'].value = '';
    addForm['opSat'].checked = true;
    addForm['openSat'].value = '';
    addForm['closeSat'].value = '';
    addForm['name'].focus();
    addForm.classList.add('visible');
    mapElement.classList.add('pinning');
};

addForm.hide = function () {
    addForm.classList.remove('visible');
    mapElement.classList.remove('pinning');
};

addForm['cancel'].onclick = function () {
    addForm.hide();
};


addForm['thumbnail'].onchange = function (e){
    if (addForm['thumbnail'].files.length===0){
        addForm.thumbnailPreview.style.backgroundImage = 'none';
        addForm.emptyThumbnail.show();
        return;
    }
    // 파일업로드
    const fileReader = new FileReader();
    fileReader.onload = function (data){
        addForm.thumbnailPreview.style.backgroundImage = `url("${data.target.result}"`;
        addForm.emptyThumbnail.hide();
    }
    fileReader.readAsDataURL(addForm['thumbnail'].files[0]);
};

addForm.thumbnailPreview.onclick = function (){
    addForm['thumbnail'].click();
};


addForm.onsubmit = function (e) {
    e.preventDefault();

    if (addForm['name'].value === '') {
        alert('이름을 입력해 주세요.');
        addForm['name'].focus();
        return false;
    }
    if (addForm['contactFirst'].value === '') {
        alert('지역번호를 선택해 주세요.');
        addForm['contactFirst'].focus();
        return false;
    }
    if (addForm['description'].value === '') {
        alert('설명을 입력해 주세요.');
        addForm['description'].focus();
        return false;
    }
    if (addForm['lat'].value === '' || addForm['lng'].value === '' || addForm['addressPrimary'].value === '') {
        alert('위치가 올바르지 않거나 설정되지 않았습니다. 지도를 움직여 올바른 위치를 지정해 주세요.');
        return false;
    }
    if (addForm['thumbnail'].files.length < 1) {
        alert('대표 이미지를 선택해 주세요.');
        return false;
    }

    const dayEn = ['Sun', 'Mon', 'Tue', 'Thu', 'Fri', 'Sat'];
    const DayKo = ['일', '월', '화', '수', '목', '금', '토'];
    if (dayEn.every(x => !addForm[`op${x}`].checked)) {
        alert('주중 하루 이상 영업하여야 합니다.');
        return false;
    }
    for (let i = 0; i < dayEn.length; i++) {
        if (addForm['opSun'].checked && (addForm['opSun'].value === '' || addForm['closeSun'].value === '')) {
            alert('일요일 영업 시간을 선택해 주세요.');
            return false;
        }
    }
};

if (addMatzip) {
    addMatzip.onclick = function () {
        addForm.show();
    };
}
