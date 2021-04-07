import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Select, Text } from 'grommet';
import { DataViewer } from '../Viewer/DataViewer';
import { StatBox } from '../Viewer/StatBox';
const AV = require('leancloud-storage');

const DEMOS = {
  'Escort': '606561de2c9df85c5744bf49',
  'Assault': '606943429d29e66a14fe43bc',
  'Hybrid': '60692ca668637730b738db55',
  'Control': '60691df89d29e66a14fe2d10'
}

export const Demo = (props) => {
  const history = useHistory();
  const [type, setType] = useState('Escort');
  const [data, setData] = useState(null);
  const [replay, setReplay] = useState(null);

  useEffect(() => {
    const replayQ = new AV.Query('Replay');
    replayQ.equalTo('objectId', DEMOS[type]);
    replayQ.select(['json', 'csv', 'status']);
    replayQ.first()
      .then((r) => {
        if (r && r.get('status') === 2) {
          fetch(r.get('json').url())
            .then(res => res.json())
            .then(d => {
              setData(d);
              setReplay(r);
            })
            .catch(error => {
              console.log(error);
              history.push('/');
            });
        } else {
          history.push('/');
        }
      });
  },[type, history]);

  return(
    <Box pad={{vertical: 'medium', horizontal: 'large'}} gap='medium'>
      <StatBox>
        <Box direction='row' align='center' justify='start' gap='xsmall'>
          <Text size='small'>Type</Text>
          <Box direction='row' width='200px'>
            <Select
              options={Object.keys(DEMOS)}
              value={type}
              onChange={({value}) => {
                if (value !== type) setType(value);
              }}/>
          </Box>
        </Box>
      </StatBox>
      {data && replay && (
        <DataViewer data={data} replay={replay}/>
      )}
    </Box>
  );
}
