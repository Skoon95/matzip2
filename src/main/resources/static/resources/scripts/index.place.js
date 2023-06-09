const placeList = document.getElementById('placeList');

//  마커를 지우기 위해서는 마커를 기억하고 있어야 한다.
let placeMakers = [];


function loadPlaces() {
//      이 함수를 index.map.js에 호출해야한다.

    function createListItem(place) {
        const htmlText =
            //  용점반점 만들어 놓은 것  전체 문자열이다 이것을 html바꾸는 작업이 필요하다.
            `
    <li class="item">
        <div class="spec-container">
            <div class="name-container">
                <span class="name">${place['name']}</span>
                <span class="category">몰?루</span>
            </div>
            <div class="op-container">
                <span class="op-flag">나중에</span>
                <span class="op-time">나중에</span>
            </div>
            <div class="address-container">
                <span class="address">${place['addressPrimary']}</span>
            </div>
        </div>
        <div class="image-container">
            <img alt="" class="image"
                 src="/place/thumbnail?index=${place['index']}">
                <span class="count">?</span>
        </div>
    </li>`;
        // html파일로 바꾸는 작업은 아래와 같다.
        const domParser = new DOMParser();
        // 전달해주는 문자열 구조로 부터 dom 문자열로 만들어주는 구조이다.
        //     dom이라는 상수는 가상의 html문서 상태가 된다.
        const dom = domParser.parseFromString(htmlText, 'text/html');
        const listItem = dom.querySelector('li');
        return listItem;

        //  선생님 작업
        //      return new DOMParser().parseFromString(htmlText, 'text/html').quertSelector('li');

    }


//     서남 동북 위경도 이상 이하로 가지고 와야한다.
    const sw = mapElement.object.getBounds().getSouthWest();
    const ne = mapElement.object.getBounds().getNorthEast();
    // sw/ne의 Ma -> latitude랑 비교, sw/ne의  La -> longitude랑 비교
    console.log(sw);
    console.log(ne);


    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/place/?minLat=${sw.Ma}&minLng=${sw.La}&maxLat=${ne.Ma}&maxLng=${ne.La}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {

                // const incomingPlaces = JSON.parse(xhr.responseText);
                // for(const oldPlace of places){
                //     if(!incomingPlaces.comtains(oldPlace)){
                //
                //     }
                // }

                //  아래코드로 인해 기존에 html에 적은 용정반점 내용이 사라진다.
                placeList.querySelectorAll(':scope>.item').forEach(item => item.remove());

                //  마커 지우는것
                for (const placeMaker of placeMakers) {
                    placeMaker.setMap(null);
                }
                placeMakers = []; //재할당하는것이다.

                // 마커 생성
                const places = JSON.parse(xhr.responseText);
                for (const place of places) {

                    const listItem = createListItem(place);
                    listItem.onclick = function () {
                        detail.show(place); //디테일 불러오기
                    }
                    placeList.append(listItem);

                    const position = new kakao.maps.LatLng(place['latitude'], place['longitude']);
                    const marker = new kakao.maps.Marker({
                        'position': position
                    });
                    kakao.maps.event.addListener(marker, 'click', function () {
                        detail.show(place);
                    });
                    // 화면에다가 찍어야하닌깐
                    marker.setMap(mapElement.object);
                    placeMakers.push(marker);
                }

            } else {


            }
        }
    };
    xhr.send();
}


const detail = document.getElementById('detail');
detail.thumbnail = detail.querySelector('[rel="thumbnail"]');
detail.name = detail.querySelector('[rel="name"]');
detail.contact = detail.querySelector('[rel="contact"]');
detail.address = detail.querySelector('[rel="address"]');
detail.description = detail.querySelector('[rel="description"]');
detail.time = detail.querySelector('[rel="time"]');

const detailClose = document.getElementById('detailClose');

detail.show = function (place) {
    detail.thumbnail.setAttribute('src', `/place/thumbnail?index=${place['index']}`);
    detail.name.innerText = place['name'];
    detail.contact.innerText = `${place['contactFirst']}-${place['contactSecond']}-${place['contactThird']}`;
    detail.address.innerText = `${place['addressPrimary']} ${place['addressSecondary']}`;
    detail.description.innerText = place['description'];

    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysKo = ['일', '월', '화', '수', '목', '금', '토'];
    for (const day of daysEn) {
        const dayObject = JSON.parse(place['time'])[day];
        const tr = detail.time.querySelector(`[data-day="${day}"]`);
        if (dayObject['operates'] === true) {
            tr.classList.remove('off');
            tr.innerHTML = `
            <th>${daysKo[daysEn.indexOf(day)]}</th>
            <td>${dayObject['open']}</td>
            <td>${dayObject['close']}</td>
             `;
        } else {
            tr.classList.add('off');
            tr.innerHTML = `<th>${daysKo[daysEn.indexOf(day)]}</th><td colspan="2">휴업</td>`;
        }
    }

    detail.classList.add('visible');
}

detailClose.onclick = function () {
    detail.hide();
};