import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const fantasyStarts = ['Ara','Bel','Cor','Dra','Eli','Fae','Gal','Hel','Ira','Jor','Kel','Lum','Mor','Nim','Orn','Pyre','Quel','Rin','Syl','Tor','Umb','Vor','Wy','Xan','Yel','Zor'];
const fantasyEnds = ['dor','miri','thas','drael','wyn','phos','gorn','lith','vash','dun','reth','sor','diel','rian','thor','thus'];
const businessPrefixes = ['Tech','Info','Data','Smart','Cloud','Green','Bright','Prime','Metro','Vision','Next','Peak','Core'];
const businessSuffixes = ['Solutions','Systems','Dynamics','Works','Labs','Partners','Group','Studio','Networks','Analytics','Consulting'];

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }

const NameGeneratorPage: React.FC = () => {
  const [mode, setMode] = useState<'fantasy'|'business'>('fantasy');
  const [count, setCount] = useState(5);
  const [names, setNames] = useState<string[]>([]);

  const generate = () => {
    const list: string[] = [];
    for (let i=0;i<count;i++) {
      if (mode==='fantasy') {
        list.push(randomItem(fantasyStarts)+randomItem(fantasyEnds));
      } else {
        list.push(randomItem(businessPrefixes)+" "+randomItem(businessSuffixes));
      }
    }
    setNames(list);
  };

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5" gutterBottom>Navngenerator</Typography>
      <Typography variant="body2" gutterBottom>Lag tilfeldige fantasy-navn eller bedriftsnavn.</Typography>
      <Box sx={{ display:'flex', gap:2, flexWrap:'wrap', mt:2 }}>
        <Button variant={mode==='fantasy'?'contained':'outlined'} onClick={()=>setMode('fantasy')}>Fantasy</Button>
        <Button variant={mode==='business'?'contained':'outlined'} onClick={()=>setMode('business')}>Bedrift</Button>
        <TextField type="number" label="Antall" value={count} onChange={e=>setCount(+e.target.value)} sx={{ width:120 }} />
        <Button variant="contained" onClick={generate}>Generer</Button>
      </Box>
      <Box sx={{ mt:3, display:'flex', flexWrap:'wrap', gap:1 }}>
        {names.map((n,i)=>(<Typography key={i} sx={{ px:1, py:0.5, borderRadius:1, bgcolor:'primary.main', color:'#fff' }}>{n}</Typography>))}
      </Box>
    </Paper>
  );
};

export default NameGeneratorPage;
