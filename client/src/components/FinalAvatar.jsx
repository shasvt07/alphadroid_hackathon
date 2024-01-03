import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import scene from "../assets/test1.glb";
import idleScene from "../animations/M_Standing_Idle_001.glb";
import talkinScene from "../animations/expression/M_Talking_Variations_002.glb";
import welcomeScene from "../animations/expression/M_Standing_Expressions_001.glb";
import * as THREE from "three";
import { useControls } from "leva";
import { useFrame, useLoader } from "@react-three/fiber";
import demoaudio from "../assets/charlievoice.mp3";
import jsonFile from "../assets/charlievoice.json";
import Phonetics, { metaphone } from "phonetics";
const corresponding = {
  A: "viseme_aa",
  B: "viseme_E",
  C: "viseme_CH",
  D: "viseme_DD",
  E: "viseme_E",
  F: "viseme_FF",
  G: "viseme_kk",
  H: "viseme_TH",
  I: "viseme_I",
  J: "viseme_SS",
  K: "viseme_kk",
  L: "viseme_nn",
  M: "viseme_PP",
  N: "viseme_nn",
  O: "viseme_O",
  P: "viseme_PP",
  Q: "viseme_U",
  R: "viseme_RR",
  S: "viseme_SS",
  T: "viseme_TH",
  U: "viseme_U",
  V: "viseme_FF",
  W: "viseme_U",
  X: "viseme_PP",
  Y: "viseme_I",
  Z: "viseme_SS",
};

export default function FinalAvatar(props) {
  
  const [animation, setAnimation] = useState("Wellcome");
  const [text, setText] = useState("Alphadroid brings the power of AI to elevate your user experience");
  const [spell, setSpell] = useState("");
  const spellTime = useRef(0);
  const group = useRef();
  const avatar = useRef();

  const { nodes, scene } = useGLTF(
    props.avatarUrl + "?morphTargets=Oculus Visemes"
  );
  console.log(nodes);
  const { animations: idleAnimation } = useGLTF(idleScene);
  const { animations: talkingAnimation } = useGLTF(talkinScene);
  const { animations: welcomeAnimation } = useGLTF(welcomeScene);

  const generateAudio = (text) => {
    const msg = new SpeechSynthesisUtterance();
    msg.volume = 1; // 0 to 1
    msg.rate = 0.8; // 0.1 to 10
    msg.pitch = 1.5; // 0 to 2
    msg.text = text;

    const voice = {
      name: "Daniel",
      lang: "en-GB",
    };
    msg.voiceURI = voice.name;
    msg.lang = voice.lang;
    msg.onend = () => {
      setAnimation("Idle");
    };
    return msg;
  };


  const { playAudio, headFollow, smoothMorphTarget, morphTargetSmoothing } =
    useControls({
      playAudio: false,
      headFollow: true,
      smoothMorphTarget: true,
      morphTargetSmoothing: 0.5,
    });

  idleAnimation[0].name = "Idle";
  talkingAnimation[0].name = "Talking";
  welcomeAnimation[0].name = "Wellcome";
  const allAnimation = useAnimations(
    [idleAnimation[0], talkingAnimation[0], welcomeAnimation[0]],
    scene
  );
  const { actions } = allAnimation;
  useEffect(() => {
    actions[animation].reset().play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);


  useFrame(() => {
    const currentAudioTime = Date.now()/1000;
    if(currentAudioTime > spellTime.current + 0.3){
      spellTime.current = currentAudioTime+0.3;
    }
    if ((speechSynthesis.paused || !speechSynthesis.speaking)) {
      if(animation === 'Talking'){
        setAnimation("Idle");
      }
      return;
    }
    Object.values(corresponding).forEach((value) => {
      if (!smoothMorphTarget) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = 0;
      } else {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );

        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );
      }
    });
    for (let i = 0; i < spell.length; i++) {
      const mouthCue = spell[i];
      console.log(corresponding[mouthCue]);
      if (
        currentAudioTime >= spellTime.current &&
        mouthCue in corresponding
      ) {
        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
              corresponding[mouthCue]
            ]
          ] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
              corresponding[mouthCue]
            ]
          ] = 1;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
              corresponding[mouthCue]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
              nodes.Wolf3D_Head.morphTargetDictionary[
                corresponding[mouthCue]
              ]
            ],
            1,
            morphTargetSmoothing
          );
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
              corresponding[mouthCue]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
              nodes.Wolf3D_Teeth.morphTargetDictionary[
                corresponding[mouthCue]
              ]
            ],
            1,
            morphTargetSmoothing
          );
        }
        break;
      }
    }
  });

  useEffect(() => {
    nodes.Wolf3D_Head.morphTargetInfluences[
      nodes.Wolf3D_Head.morphTargetDictionary["viseme_I"]
    ] = 0;
    nodes.Wolf3D_Teeth.morphTargetInfluences[
      nodes.Wolf3D_Teeth.morphTargetDictionary["viseme_I"]
    ] = 1;
    if (playAudio) {
      const msg = generateAudio(
        'Alphadroid brings the power of AI to elevate your user experience. We want to make service robots viable and affordable for every business. Hospitality is our starting point.'
      );
      const phonetics = metaphone(msg.text);
      setSpell(phonetics);
      speechSynthesis.speak(msg);
      setAnimation("Talking");
    } else {
        if(animation === 'Talking')
          setAnimation("Idle");
    }
  }, [playAudio]);
  useFrame((state) => {
    if (headFollow) {
      group.current.getObjectByName("LeftEye").lookAt(state.camera.position);
      group.current.getObjectByName("RightEye").lookAt(state.camera.position);
    }
  });

  return (
    <group {...props} ref={group} dispose={null}>
      <primitive object={scene} ref={avatar} />
    </group>
  );
}

useGLTF.preload(idleScene);
useGLTF.preload(talkinScene);
useGLTF.preload(welcomeScene);