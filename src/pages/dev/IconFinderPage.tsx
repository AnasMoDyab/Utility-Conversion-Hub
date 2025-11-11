import React, { useState, useMemo } from 'react';
import { Paper, Typography, TextField, Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CloudIcon from '@mui/icons-material/Cloud';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import BuildIcon from '@mui/icons-material/Build';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import FilterListIcon from '@mui/icons-material/FilterList';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import WifiIcon from '@mui/icons-material/Wifi';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';

type IconDef = { name:string; Component: React.ElementType };
const ICONS: IconDef[] = [
  { name:'Home', Component: HomeIcon },
  { name:'Search', Component: SearchIcon },
  { name:'Settings', Component: SettingsIcon },
  { name:'Info', Component: InfoIcon },
  { name:'Delete', Component: DeleteIcon },
  { name:'Edit', Component: EditIcon },
  { name:'Add', Component: AddIcon },
  { name:'CheckCircle', Component: CheckCircleIcon },
  { name:'Close', Component: CloseIcon },
  { name:'Warning', Component: WarningIcon },
  { name:'Favorite', Component: FavoriteIcon },
  { name:'Star', Component: StarIcon },
  { name:'Person', Component: PersonIcon },
  { name:'Lock', Component: LockIcon },
  { name:'Cloud', Component: CloudIcon },
  { name:'Download', Component: DownloadIcon },
  { name:'Upload', Component: UploadIcon },
  { name:'CalendarToday', Component: CalendarTodayIcon },
  { name:'Phone', Component: PhoneIcon },
  { name:'Email', Component: EmailIcon },
  { name:'Visibility', Component: VisibilityIcon },
  { name:'VisibilityOff', Component: VisibilityOffIcon },
  { name:'ArrowBack', Component: ArrowBackIcon },
  { name:'ArrowForward', Component: ArrowForwardIcon },
  { name:'Menu', Component: MenuIcon },
  { name:'Save', Component: SaveIcon },
  { name:'Share', Component: ShareIcon },
  { name:'Print', Component: PrintIcon },
  { name:'Refresh', Component: RefreshIcon },
  { name:'Build', Component: BuildIcon },
  { name:'Code', Component: CodeIcon },
  { name:'Security', Component: SecurityIcon },
  { name:'ShoppingCart', Component: ShoppingCartIcon },
  { name:'Payment', Component: PaymentIcon },
  { name:'LocationOn', Component: LocationOnIcon },
  { name:'Map', Component: MapIcon },
  { name:'Send', Component: SendIcon },
  { name:'Chat', Component: ChatIcon },
  { name:'FilterList', Component: FilterListIcon },
  { name:'Pause', Component: PauseIcon },
  { name:'PlayArrow', Component: PlayArrowIcon },
  { name:'Stop', Component: StopIcon },
  { name:'PlayCircle', Component: PlayCircleIcon },
  { name:'PauseCircle', Component: PauseCircleIcon },
  { name:'BatteryFull', Component: BatteryFullIcon },
  { name:'BatteryChargingFull', Component: BatteryChargingFullIcon },
  { name:'Wifi', Component: WifiIcon },
  { name:'Bluetooth', Component: BluetoothIcon },
  { name:'DarkMode', Component: DarkModeIcon },
  { name:'LightMode', Component: LightModeIcon },
  { name:'Brightness4', Component: Brightness4Icon },
];

const IconFinderPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const results = useMemo(()=> {
    const q = query.trim().toLowerCase();
    if (!q) return ICONS;
    return ICONS.filter(i => i.name.toLowerCase().includes(q));
  }, [query]);

  const copySnippet = (name:string) => {
    const snippet = `import ${name}Icon from '@mui/icons-material/${name}';\n\n<${name}Icon fontSize="medium" />`;
    navigator.clipboard?.writeText(snippet);
    setCopied(name);
    setTimeout(()=>setCopied(null), 1500);
  };

  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">Material UI Icon Finder</Typography>
      <Typography variant="body2" sx={{ mt:1 }}>Search common @mui/icons-material icons. Click to copy import + usage snippet.</Typography>
      <TextField fullWidth placeholder="Search icons (e.g. 'home', 'cloud')" sx={{ mt:1 }} value={query} onChange={e=>setQuery(e.target.value)} />
      <Typography variant="caption" sx={{ mt:1, display:'block' }}>{results.length} result(s)</Typography>
      <Box sx={{ mt:1, display:'grid', gap:1, gridTemplateColumns:{ xs:'repeat(3,1fr)', sm:'repeat(6,1fr)', md:'repeat(8,1fr)' } }}>
        {results.map(({ name, Component }) => (
          <Button key={name} onClick={()=>copySnippet(name)} sx={{ flexDirection:'column', minHeight:72, border:'1px solid #ddd' }} variant="outlined">
            <Component fontSize="medium" />
            <Typography variant="caption" sx={{ mt:0.5 }}>{name}</Typography>
            {copied===name && <Typography variant="caption" color="success.main">Copied!</Typography>}
          </Button>
        ))}
      </Box>
      <Box sx={{ mt:2 }}>
        <Typography variant="subtitle2">Usage Example</Typography>
  <TextField fullWidth multiline minRows={3} value={`import HomeIcon from '@mui/icons-material/Home';\n\nfunction Example(){\n  return <HomeIcon fontSize="large" color="primary" />;\n}`} />
      </Box>
    </Paper>
  );
};
export default IconFinderPage;
