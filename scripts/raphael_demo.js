(function(){
    // This file depends on the runtime extensions, which should probably be moved into this namespace rather than made global
    
// Raphael Extensions (making life easier on our script templates)

// Provide the arc of a circle, given the radius and the angles to start and stop at
Raphael.fn.arcslice = function(radius, fromangle, toangle){
       var x1 = Math.cos(deg2rad(fromangle)) * radius, 
           y1 = Math.sin(deg2rad(fromangle)) * radius,
           x2 = Math.cos(deg2rad(toangle)) * radius, 
           y2 = Math.sin(deg2rad(toangle)) * radius;
        var arc = this.path();
        arc.moveTo(x1, y1).arcTo(radius, radius, 0, 1, x2,y2, rad2deg(toangle - fromangle));
        return arc;
};

Raphael.fn.regularPolygon = function(cx,cy,radius, sides, pointsOnly){
    var angle = 0;
    var theta = Math.PI * 2 / sides;
    var x = Math.cos(0) * radius + cx;
    var y = Math.sin(0) * radius + cy;
    if (pointsOnly){
        var points = [[x,y]];
    }else{
        var path = this.path();
        path.moveTo(x,y);
    }
    for (var i = 1; i < sides; i++){
        x = Math.cos(theta * i) * radius + cx;
        y = Math.sin(theta * i) * radius + cy;
        if (pointsOnly){
            points.push([x,y]);
        }else{
            path.lineTo(x,y);
        }
    }
    if (pointsOnly){
        return points;
    }else{
        path.andClose();
        return path;
    }
};


// expose these globally so the Block/Label methods can find them
window.choice_lists = {
    keys: 'abcdefghijklmnopqrstuvwxyz0123456789*+-./'
        .split('').concat(['up', 'down', 'left', 'right',
        'backspace', 'tab', 'return', 'shift', 'ctrl', 'alt', 
        'pause', 'capslock', 'esc', 'space', 'pageup', 'pagedown', 
        'end', 'home', 'insert', 'del', 'numlock', 'scroll', 'meta']),
    linecap: ['round', 'butt', 'square'],
    linejoin: ['round', 'bevel', 'mitre']
};


var menus = {
    control: menu('Control', [
        {label: 'when program runs', trigger: true, script: 'function _start(){\n[[next]]\n}\n_start();\n'},
        {label: 'when [choice:keys] key pressed', trigger: true, script: '$(document).bind("keydown", "{{1}}", function(){\nconsole.log("{{1}}");\n[[next]]\nreturn false;});'},
        {label: 'every 1/[number:30] of a second', trigger: true, script: 'setInterval(function(){\n[[next]]},\n1000/{{1}}\n);'},
        {label: 'wait [number:1] secs', script: 'setTimeout(function(){\n[[next]]},\n1000*{{1}}\n);'},
        {label: 'forever', containers: 1, slot: false, script: 'while(true){\n[[1]]\n}'},
        {label: 'repeat [number:10]', containers: 1, script: 'range({{1}}).forEach(function(){\n[[1]]\n});'},
        {label: 'broadcast [string:ack] message', script: '$(".stage").trigger("{{1}}"'},
        {label: 'when I receive [string:ack] message', trigger: true, script: '$(".stage").bind("{{1}}", function(){\n[[next]]\n});'},
        {label: 'forever if [boolean]', containers: 1, slot: false, script: 'while({{1}}){\n[[1]]\n}'},
        {label: 'if [boolean]', containers: 1, script: 'if({{1}}{\n[[1]]\n}'},
        {label: 'if [boolean] else', containers: 2, script: 'if({{1}}{\n[[1]]\n}else{\n[[2]]\n}'},
        {label: 'repeat until [boolean]', script: 'while(!({{1}})){\n[[1]]\n}'}
    ], true),
    sensing: menu('Sensing', [
        {label: "ask [string:What's your name?] and wait", script: "local.answer = prompt({{1}});"},
        {label: 'answer', 'type': 'string', script: 'local.answer'},
        {label: 'mouse x', 'type': 'number', script: 'global.mouse_x'},
        {label: 'mouse y', 'type': 'number', script: 'global.mouse_y'},
        {label: 'mouse down', 'type': 'boolean', script: 'global.mouse_down'},
        {label: 'key [choice:keys] pressed?', 'type': 'boolean', script: '$(document).bind("keydown", {{1}}, function(){\n[[1]]\n});'},
        {label: 'stage width', 'type': 'number', script: 'global.stage_width'},
        {label: 'stage height', 'type': 'number', script: 'global.stage_height'},
        {label: 'center x', 'type': 'number', script: 'global.stage_center_x'},
        {label: 'center y', 'type': 'number', script: 'global.stage_center_y'},
        {label: 'reset timer', script: 'global.timer.reset()'},
        {label: 'timer', 'type': 'number', script: 'global.timer.value()'}
    ]),
    operators: menu('Operators', [
        {label: '[number:0] + [number:0]', type: 'number', script: "({{1}} + {{2}})"},
        {label: '[number:0] - [number:0]', type: 'number', script: "({{1}} - {{2}})"},
        {label: '[number:0] * [number:0]', type: 'number', script: "({{1]} * {{2}})"},
        {label: '[number:0] / [number:0]', type: 'number', script: "({{1}} / {{2}})"},
        {label: 'pick random [number:1] to [number:10]', type: 'number', script: "randint({{1}}, {{2}})"},
        {label: '[number:0] < [number:0]', type: 'boolean', script: "({{1}} < {{2}})"},
        {label: '[number:0] = [number:0]', type: 'boolean', script: "({{1}} == {{2}})"},
        {label: '[number:0] > [number:0]', type: 'boolean', script: "({{1}} > {{2}})"},
        {label: '[boolean] and [boolean]', type: 'boolean', script: "({{1}} && {{2}})"},
        {label: '[boolean] or [boolean]', type: 'boolean', script: "({{1}} || {{2}})"},
        {label: 'not [boolean]', type: 'boolean', script: "(! {{1}})"},
        {label: 'join [string:hello] with [string:world]', type: 'string', script: "({{1}} + {{2}})"},
        {label: 'letter [number:1] of [string:world]', type: 'string', script: "{{2}}[{{1}}"},
        {label: 'length of [string:world]', type: 'number', script: "({{1}}.length)"},
        {label: '[number:0] mod [number:0]', type: 'number', script: "({{1}} % {{2}})"},
        {label: 'round [number:0]', type: 'number', script: "Math.round({{1}})"},
        {label: 'absolute of [number:10]', type: 'number', script: "Math.abs({{2}})"},
        {label: 'arccosine degrees of [number:10]', type: 'number', script: 'rad2deg(Math.acos({{1}}))'},
        {label: 'arcsine degrees of [number:10]', type: 'number', script: 'rad2deg(Math.asin({{1}}))'},
        {label: 'arctangent degrees of [number:10]', type: 'number', script: 'rad2deg(Math.atan({{1}}))'},
        {label: 'ceiling of [number:10]', type: 'number', script: 'Math.ceil({{1}})'},
        {label: 'cosine of [number:10] degrees', type: 'number', script: 'Math.cos(deg2rad({{1}}))'},
        {label: 'sine of [number:10] degrees', type: 'number', script: 'Math.sin(deg2rad({{1}}))'},
        {label: 'tangent of [number:10] degrees', type: 'number', script: 'Math.tan(deg2rad({{1}}))'},
        {label: '[number:10] to the power of [number:2]', type: 'number', script: 'Math.pow({{1}}, {{2}})'},
        {label: 'round [number:10]', type: 'number', script: 'Math.round({{1}})'},
        {label: 'square root of [number:10]', type: 'number', script: 'Math.sqrt({{1}})'}
    ]),
    shapes: menu('Shapes', [
        {label: 'circle with radius [number:0]', script: 'local.shape = global.paper.circle(0, 0, {{1}});'},
        {label: 'rect with width [number:0] and height [number:0]', script: 'local.shape = global.paper.rect(0, 0, {{1}}, {{2}});'},
        {label: 'rounded rect with width [number:0] height [number:0] and radius [number:0]', script: 'local.shape = global.paper.rect(0, 0, {{1}}, {{2}}, {{3}});'},
        {label: 'ellipse x radius [number:0] y radius [number:0]', script: 'local.shape = global.paper.ellipse(0, 0, {{1}}, {{2}});'},
        {label: 'arc at radius [number:100] from [number:0] degrees to [number:30] degrees',
          script: 'local.shape = global.paper.arcslice({{1}}, {{2}}, {{3}});'},
        {label: 'image src: [string:http://waterbearlang.com/images/waterbear.png]', script: 'local.shape = global.paper.image("{{1}}", {{0}}, {{0}});'},
        {label: 'name shape: [string:shape1]', script: 'local.shape_references["{{1}}"] = local.shape;'},
        {label: 'refer to shape [string:shape1]', script: 'local.shape = local.shape_references["{{1}}"];'},
        {label: 'with shape [string:shape1] do', containers: 1, script: 'local.oldshape = local.shape;\nlocal.shape = local.shape_references["{{1}}"];\n[[1]]\nlocal.shape = local.oldshape;'},
        {label: 'clip rect x [number:0] y [number:0] width [number:50] height [number:50]', script: 'local.shape.attr("clip-rect", "{{1}},{{2}},{{3}},{{4}}");'},
        {label: 'fill color [color:#FFFFFF]', script: 'local.shape.attr("fill", "{{1}}");'},
        {label: 'stroke color [color:#000000]', script: 'local.shape.attr("stroke", "{{1}}");'},
        {label: 'fill transparent', script: 'local.shape.attr("fill", "transparent");'},
        {label: 'stroke transparent', script: 'local.shape.attr("stroke", "transparent");'},
        {label: 'stroke linecap [choice:linecap]', script: 'local.shape.attr("stroke-linecap", "{{1}}");'},
        {label: 'stroke linejoin [choice:linejoin]', script: 'local.shape.attr("stroke-linejoin", "{{1}}");'},
        {label: 'stroke opacity [number:100]%', script: 'local.shape.attr("stroke-opacity", "{{1}}%");'},
        {label: 'stroke width [number:1]', script: 'local.shape.attr("stroke-width", {{1}});'},
        {label: 'rotate [number:5] degrees', script: 'local.shape.attr("rotate", local.shape.attr("rotate") + {{1}});'},
        {label: 'rotate [number:5] degrees around x [number:0] y [number:0]', script: 'local.shape.rotate(angle(local.shape) + {{1}}, {{2}}, {{3}});'},
        {label: 'clone', script: 'local.shape = local.shape.clone()'},
        {label: 'fill opacity [number:100]%', script: 'local.shape.attr("fill-opacity", "{{1}}%")'},
        {label: 'href [string:http://waterbearlang.com]', script: 'local.shape.attr("href", "{{1}}")'},
        {label: 'text [string:Hello World] at x: [number:0] y: [number:0]', script: 'local.shape = global.paper.text("{{1}}", {{2}}, {{3}});' }
        // {label: 'font family: [string:Helvetica] weight: [number:0] style: [fontstyle]', script: 'FIXME'}
    ]),
    text: menu('Sketchy', [
        {label: 'sketchy rect with width [number:50] and height [number: 50]', script: 'local.shape = global.paper.sk_rect(0,0, {{1}},{{2}};'},
        {label: 'sketchy ellipse with width [number:50] and height [number:50]', script: 'local.shape = global.paper.sk_ellipse(0,0, {{1}}, {{2}};'},
        {label: 'sketchy line from x1 [number:10] y1 [number:10] to x2 [number:40] y2 [number:40]', script: 'local.shape = global.paper.sk_line({{1}}, {{2}}, {{3}}, {{4}});'}
    ]),
    transform: menu('Transform', [
        {label: 'clear canvas', script: 'global.paper.clear();'},
        {label: 'hide', script: 'local.shape.hide();'},
        {label: 'show', script: 'local.shape.show();'},
        {label: 'rotate by [number:0]', script: 'local.shape.rotate({{1}}, false);'},
        {label: 'rotate to [number:0]', script: 'local.shape.rotate({{1}}, true);'},
        {label: 'rotate to [number:0] around x: [number:0] y: [number:0]', script: 'local.shape.rotate({{1}}, {{2}}, {{3}}, true);'},
        {label: 'translate by x: [number:0] y: [number:0]', script: 'local.shape.translate({{1}}, {{2}});'},
        {label: 'position at x [number:0] y [number:0]', script: 'local.shape.attr("translation", ""+{{1}} +"," + {{2}});'},
        {label: 'size width [number:100] height [number:100]', script: 'local.shape.attr({width: {{1}}, height: {{2}})'},
        {label: 'scale by [number:0]', script: 'local.shape.scale({{1}}, {{2}});'},
        {label: 'scaled by [number:0] centered at x: [number:0] y: [number:0]', script: 'local.shape.scale({{1}}, {{2}}, {{3}}, {{4}});'},
        {label: 'to front', script: 'local.shape.toFront();'},
        {label: 'to back', script: 'local.shape.toBack();'}
    ])
};

var demos = {
};
populate_demos_dialog(demos);

})();