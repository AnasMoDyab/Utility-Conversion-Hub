import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack, MenuItem } from '@mui/material';
import { cupsToGrams, gramsToCups, gramsToOunces, ouncesToGrams } from '../utils/extraConversions';

const ingredients = ['mel','sukker','smør','ris'];

const CookingPage: React.FC = () => {
  const [ingredient, setIngredient] = useState('mel');
  const [cups, setCups] = useState(1);
  const [grams, setGrams] = useState(100);
  return (
    <Card variant="outlined" sx={{ maxWidth: 700 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Matlagingsenheter</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom><b>Om denne funksjonen:</b> Konverter mellom kopper, gram og unser basert på enkel ingrediensdensitet.</Typography>
        <Stack spacing={2}>
          <TextField select fullWidth label="Ingrediens" value={ingredient} onChange={e => setIngredient(e.target.value)}>
            {ingredients.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </TextField>
          <TextField type="number" label="Kopper" fullWidth value={cups} onChange={e => setCups(+e.target.value)} />
          <Typography>Gram fra kopper: {cupsToGrams(cups, ingredient)}</Typography>
          <TextField type="number" label="Gram" fullWidth value={grams} onChange={e => setGrams(+e.target.value)} />
          <Typography>Kopper fra gram: {gramsToCups(grams, ingredient).toFixed(3)}</Typography>
          <Typography>Unser fra gram: {gramsToOunces(grams).toFixed(2)}</Typography>
          <Typography>Gram fra unser (1 oz): {ouncesToGrams(1).toFixed(2)}</Typography>
        </Stack>
        <Typography variant="caption" mt={2}>Verdiene er omtrentlige.</Typography>
      </CardContent>
    </Card>
  );
};
export default CookingPage;
