ymaps.ready(init);

function init(){
    var myMap = new ymaps.Map("map_dynamic", {
        center: [55.831054, 37.629914],
        zoom: 15
        }, {
            restrictMapArea: [[55.843203, 37.608155], [55.821900, 37.654070]]
        });
    
    ['zoomControl', 'searchControl', 'rulerControl',
    'typeSelector', 'fullscreenControl', 'trafficControl'].forEach(elem => myMap.controls.remove(elem));


    async function addRouteOnMap(arrofpoints) {
        myMap.geoObjects.removeAll();
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: arrofpoints,
            params: {
                routingMode: 'pedestrian'
            }
        }, {
            boundsAutoApply: true
        });
        myMap.geoObjects.add(multiRoute);   
    }
    document.getElementById("add_on_map").addEventListener("click", () => {
        var allpoints = [];
        Array.from(document.getElementsByClassName("point_input")).forEach(elem => {
            if (elem.value !== "") {
                allpoints.push(Coords.pointCoords([elem.value])[0]);  
            }
            elem.value = "";
        });
        addRouteOnMap(allpoints);
        console.log(allpoints);
    });
}


document.getElementById("add_btn").addEventListener("click", () => {
    for (let i = 0; i < 5; i++){
        if (Array.from(document.getElementsByClassName("point_input"))[i].style.display === "none") {
            Array.from(document.getElementsByClassName("point_input"))[i].style.display = "block";
            break;
        }
    }
});

document.getElementById("del_btn").addEventListener("click", () => {
    for (let i = 4; i > 0; i--){
        if (Array.from(document.getElementsByClassName("point_input"))[i].style.display === "block") {
            Array.from(document.getElementsByClassName("point_input"))[i].style.display = "none";
            document.getElementsByClassName("point_input")[i].value = "";
            break;
        }
    }
});


$(function() {
    $("#to_favorites").bind("click", function () {
        var s = "";
        $.each(document.getElementsByClassName("point_input"), function (ind, elem) {
            if ($(elem).val() !== "") {
                s += $(elem).val() + ",";
                console.log($(elem).val());
            }
        });
        $.getJSON($SCRIPT_ROOT + '/favorites_dynamic', {
            pnts: s
            });
    });
    $("#add_on_map").bind("click", function () {
        var s = "";
        $.each(document.getElementsByClassName("point_input"), function (ind, elem) {
            if ($(elem).val() !== "") {
                s += $(elem).val() + ",";
                console.log($(elem).val());
            }
        });
        $.getJSON($SCRIPT_ROOT + '/history_dynamic', {
            pnts: s
            });
    });
});


