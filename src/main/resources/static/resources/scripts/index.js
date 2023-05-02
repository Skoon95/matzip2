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
    coverElement.onclick =f;
}
coverElement.hide = () => {
    coverElement.classList.remove('visible');
    coverElement.onclick = undefined;
}

const methods = {
    showLogin: (x,e)   => {
        coverElement.show(()=>coverElement.hide());
        alert('로그인해야함!');
    },
    logout: (x,e) => {
        alert('로그아웃 해야함');
    }
};

document.body.querySelectorAll('[data-method]').forEach(x =>{
   if (typeof methods[x.dataset.method]==='function'){
       x.addEventListener('click',e =>{
           methods[x.dataset.method](x,e);
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

