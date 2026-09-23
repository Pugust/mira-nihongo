'use strict';
(function(root){
  const H={
    person:['head','neck','torso','left_arm','right_arm','left_leg','right_leg','hand'],
    head:['face','hair','left_ear','right_ear'],face:['left_eye','right_eye','left_eyebrow','right_eyebrow','nose','mouth'],mouth:['upper_lip','lower_lip','teeth'],
    left_arm:['left_elbow','left_forearm','hand'],right_arm:['right_elbow','right_forearm','hand'],left_leg:['left_knee','left_shin','left_foot'],right_leg:['right_knee','right_shin','right_foot'],
    hand:['palm','wrist','thumb','index_finger','middle_finger','ring_finger','pinky_finger'],
    car:['bodywork','door','window','headlight','mirror','wheel'],wheel:['tire','rim','valve'],door:['handle','window'],
    bicycle:['wheel','handlebar','pedal','chain','saddle'],tree:['trunk','branch','leaf','bark'],plant:['stem','leaf','flower'],potted_plant:['pot','plant'],
    building:['wall','window','door','roof'],house:['wall','window','door','roof'],computer:['monitor','keyboard','mouse'],keyboard:['key'],mouse:['mouse_button','scroll_wheel'],
    bottle:['cap','label'],chair:['seat','backrest','leg'],table:['tabletop','leg'],book:['cover','page'],phone:['screen','button'],cell_phone:['screen','button']
  };
  function expectedParts(k){return(H[k]||[]).slice()}
  function accepts(parent,child){return !parent||expectedParts(parent).includes(child)}
  function depth(scene,e){let d=0,p=e;while(p?.parentId&&d<20){p=scene.entities.find(x=>x.id===p.parentId);d++}return d}
  root.MiraVisualHierarchyV1={H,expectedParts,accepts,depth};
  if(typeof module!=='undefined')module.exports=root.MiraVisualHierarchyV1;
})(typeof window!=='undefined'?window:globalThis);
