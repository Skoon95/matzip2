const addForm = document.getElementById('addForm');
const addMatzip = document.getElementById('addMatzip');

addForm.emptyThumbnail = addForm.querySelector('[rel="emptyThumbnail"]');

addForm.show = function() {
    addForm['name'].value = '';
    addForm['contactFirst'].value = '';
    addForm['contactSecond'].value = '';
    addForm['contactThird'].value = '';
    addForm['description'].value = '';
    addForm['lat'].value = '';
    addForm['lng'].value = '';
    addForm['addressPrimary'].value = '';
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

addForm.hide = function() {
    addForm.classList.remove('visible');
    mapElement.classList.remove('pinning');
};

addForm['cancel'].onclick = function() {
    addForm.hide();
};

addForm.onsubmit = function(e) {
    e.preventDefault();

    // TODO
};

addMatzip.onclick = function() {
    addForm.show();
};