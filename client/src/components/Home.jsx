import { useState } from 'react'
import { Canvas } from '@react-three/fiber';
import Avatar from './Avatar';
import { OrbitControls } from "@react-three/drei";
import { ContactShadows, Environment } from '@react-three/drei';
import FinalAvatar from './FinalAvatar';
import Chats from './Chats';
import { useNavigate ,useLocation} from 'react-router-dom';

function Home() {
    const location = useLocation();
    const {avatarMode,avatarUrl} =location.state;
    const navigate = useNavigate();
    if(avatarMode || avatarUrl===''){
        navigate('/');
    }
  return (
    <div style={{ height: "100vh", width: "100vw", display:'flex', flexDirection:'row'}}>
        <div style={{flex:2}}> 
            <Chats />
        </div>
    <Canvas shadows camera={{ position: [0,0,12], fov: 30 }} style={{flex:2}}>
        <OrbitControls enableZoom={false}/>
        <ambientLight intensity={4} />  
        <FinalAvatar position={[0,-2.5,0]} scale={2.5} avatarUrl = {avatarUrl}/>
    </Canvas>
    </div>
  )
}

export default Home