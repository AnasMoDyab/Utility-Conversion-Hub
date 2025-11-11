import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

const gitCheat: Record<string,string[]> = {
  'Basic Setup': [
    'git init','git clone <repo>','git config --global user.name "Your Name"','git config --global user.email "you@example.com"'
  ],
  'Staging & Commit': [
    'git status','git add <file>','git commit -m "message"'
  ],
  'Branching': [
    'git branch','git checkout -b <branch>','git merge <branch>'
  ],
  'Remote': [
    'git remote add origin <url>','git push origin <branch>','git pull origin <branch>'
  ],
  'Undo & Reset': [
    'git reset --hard HEAD','git revert <commit>'
  ],
  'Advanced': [
    'git stash','git log --oneline --graph','git rebase <branch>','git cherry-pick <commit>'
  ]
};

const dockerCheat: Record<string,string[]> = {
  'Basic': [ 'docker --version','docker info' ],
  'Images': [ 'docker pull <image>','docker images','docker rmi <image>' ],
  'Containers': [ 'docker run <image>','docker ps','docker ps -a','docker stop <container>','docker rm <container>' ],
  'Build': [ 'docker build -t <name> .' ],
  'Networking': [ 'docker network ls','docker network create <name>' ],
  'Volumes': [ 'docker volume ls','docker volume create <name>' ],
  'Advanced': [ 'docker exec -it <container> bash','docker-compose up' ]
};

const copy = (cmd:string) => navigator.clipboard?.writeText(cmd);

const CheatsPage: React.FC = ()=> (
  <Paper sx={{ p:2 }}>
    <Typography variant="h6">Git & Docker Cheat Sheets</Typography>
    <Typography variant="body2" sx={{ mt:1 }}>Klikk en kommando for å kopiere.</Typography>
    <Box sx={{ mt:2 }}>
      <Typography variant="subtitle1">Git</Typography>
      <Box sx={{ display:'grid', gap:1 }}>
        {Object.entries(gitCheat).map(([cat, cmds]) => (
          <Box key={cat} sx={{ border:'1px solid #ddd', borderRadius:1, p:1 }}>
            <Typography variant="caption" sx={{ fontWeight:600 }}>{cat}</Typography>
            <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:0.5 }}>
              {cmds.map(c => (
                <Button key={c} size="small" variant="outlined" onClick={()=>copy(c)} sx={{ fontFamily:'monospace', textTransform:'none' }}>{c}</Button>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
    <Box sx={{ mt:3 }}>
      <Typography variant="subtitle1">Docker</Typography>
      <Box sx={{ display:'grid', gap:1 }}>
        {Object.entries(dockerCheat).map(([cat, cmds]) => (
          <Box key={cat} sx={{ border:'1px solid #ddd', borderRadius:1, p:1 }}>
            <Typography variant="caption" sx={{ fontWeight:600 }}>{cat}</Typography>
            <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:0.5 }}>
              {cmds.map(c => (
                <Button key={c} size="small" variant="outlined" onClick={()=>copy(c)} sx={{ fontFamily:'monospace', textTransform:'none' }}>{c}</Button>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Paper>
);
export default CheatsPage;
