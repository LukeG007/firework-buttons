const socket = io();

socket.on("disconnect", () => {
    console.log("Lost Connection");
    for (let index = 0; index < fireworks_launched.length; ++index) {
        set_btn_blue(fireworks_launched[index]);
    }
})

socket.on('firework_launch', (data) => {
    set_btn_red(data['firework']);
    fireworks_launched.push(data['firework']);
});

socket.on('reset', () => {
    for (let index = 0; index < fireworks_launched.length; ++index) {
        set_btn_blue(fireworks_launched[index]);
    }
});

function get_profile_id(btn_id) {
    profile = null;
    for (var key in firework_profiles) {
        if (firework_profiles.hasOwnProperty(key)) {
            if (firework_profiles[key]["fireworks"].indexOf(btn_id) !== -1) {
                profile = key
            }
        }
    }
    return profile;
}

function add_btns(rows) {
    for (let i = 1; i < rows+1; i++) {
        profile_id = get_profile_id(i);
        profile = firework_profiles[profile_id]
        element = document.getElementById("firework_buttons");
        button = document.createElement("a");
        button_class = document.createAttribute("class");
        button_fp = document.createAttribute("profile");
        button_js_onclick = document.createAttribute("onclick");
        button_id = document.createAttribute("id");
        button_style = document.createAttribute("style");
        button_class.value = "firework_button";
        button_js_onclick.value = "trigger_firework(" + i + ");";
        button_id.value = "fb_"+i;
        button_fp.value = profile_id;
        button.innerText = "#"+i;
        if (theme == "light") {
            button_style.value = "background-color: "+profile["color"]+";";
        } else {
            button_style.value = "color: "+profile["color"]+"; border-color: "+profile["color"]+";";
        }
        button.setAttributeNode(button_class);
        button.setAttributeNode(button_js_onclick);
        button.setAttributeNode(button_id);
        button.setAttributeNode(button_fp);
        button.setAttributeNode(button_style);
        element.appendChild(button);
    }
}

function add_legend() {
    legend_div = document.getElementById("legend");
    fp_length = Object.keys(firework_profiles).length;
    for (let i = 1; i < fp_length+1; i++) {
        key = i.toString();
        color = firework_profiles[key]["color"];
        pname = firework_profiles[key]["name"];
        text = document.createElement("p");
        text_class = document.createAttribute("class");
        text_style = document.createAttribute("style");
        text.innerText = pname;
        text_class.value = "legend-txt";
        text_style.value = "color: "+color+";";
        text.setAttributeNode(text_class);
        text.setAttributeNode(text_style);
        legend_div.appendChild(text);
    }
}

function trigger_firework(fb_id) {
    socket.emit("launch_firework", {"firework": fb_id});
}

function fadeOut(element) {
    element.classList.add("remove");
}

function fadeIn(element) {
    element.classList.remove("remove")
}


function set_btn_red(btn_id) {
    button = document.getElementById("fb_" + btn_id);
    if (button != null) {
        button_color = document.createAttribute("style");
        fadeOut(button);
        button.removeAttribute("onclick");
    }
}

function reset() {
    socket.emit("exec_reset");
}

function set_btn_blue(btn_id) {
    button = document.getElementById("fb_" + btn_id);
    if (button != null) {
        fadeIn(button);
        button.removeAttribute("onclick");
        button_js_onclick = document.createAttribute("onclick");
        button_js_onclick.value = "trigger_firework(" + btn_id + ");";
        button.setAttributeNode(button_js_onclick);
    }
}

function dev(rows) {
    devbutton = document.getElementById("devbutton")
    devbutton.innerText = "Save";
    devbutton.removeAttribute("onclick");
    devbutton_js_onclick = document.createAttribute("onclick");
    devbutton_js_onclick.value = "save_fp(rows);";
    devbutton.setAttributeNode(devbutton_js_onclick);
    for (let i = 1; i < rows+1; i++) {
        button = document.getElementById("fb_" + i);
        if (button != null) {
            button.removeAttribute("onclick");
            button_js_onclick = document.createAttribute("onclick");
            button_js_onclick.value = "change_profile(" + i + ");";
            button.setAttributeNode(button_js_onclick);
        }
    }
}

function save_fp(rows) {
    socket.emit("save_fp", firework_profiles);
    devbutton = document.getElementById("devbutton")
    devbutton.innerText = "Dev";
    devbutton.removeAttribute("onclick");
    devbutton_js_onclick = document.createAttribute("onclick");
    devbutton_js_onclick.value = "dev(rows);";
    devbutton.setAttributeNode(devbutton_js_onclick);
    for (let i = 1; i < rows+1; i++) {
        button = document.getElementById("fb_" + i);
        if (button != null) {
            button.removeAttribute("onclick");
            button_js_onclick = document.createAttribute("onclick");
            button_js_onclick.value = "trigger_firework(" + i + ");";
            button.setAttributeNode(button_js_onclick);
        }
    }
}

function removeItem(array, item) {
    var i = array.length;

    while (i--) {
        if (array[i] === item) {
            array.splice(array.indexOf(item), 1);
        }
    }
}

function change_profile(btn_id) {
    button = document.getElementById("fb_" + btn_id);
    old_profile_id = parseInt(button.getAttribute("profile"));
    fp_length = Object.keys(firework_profiles).length;
    if (old_profile_id+1 > fp_length) {
        profile_id = 1;
    } else {
        profile_id = old_profile_id + 1;
    }
    new_profile = firework_profiles[profile_id];
    button.removeAttribute("style");
    button.removeAttribute("profile");
    button_style = document.createAttribute("style");
    button_fp = document.createAttribute("profile");
    if (theme == "light") {
        button_style.value = "background-color: "+new_profile["color"]+";";
    } else {
        button_style.value = "color: "+new_profile["color"]+"; border-color: "+new_profile["color"]+";";
    }
    button_fp.value = profile_id;
    button.setAttributeNode(button_style);
    button.setAttributeNode(button_fp);
    removeItem(firework_profiles[old_profile_id]["fireworks"], btn_id)
    firework_profiles[profile_id]["fireworks"].push(btn_id)
}

add_btns(rows);

add_legend();

for (let index = 0; index < fireworks_launched.length; ++index) {
    set_btn_red(fireworks_launched[index]);
}
