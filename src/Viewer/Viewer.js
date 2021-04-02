import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box } from 'grommet';
import { DataViewer } from '../Viewer/DataViewer';
const AV = require('leancloud-storage');

export const Viewer = (props) => {
  const {id} = useParams();
  const history = useHistory();

  const [data, setData] = useState(null);
  const [replay, setReplay] = useState(null);

  useEffect(() => {
    if (id === undefined) {
      history.push('/visualize');
      return;
    }

    const replayQ = new AV.Query('Replay');
    replayQ.equalTo('objectId', id);
    replayQ.select(['json', 'csv']);
    replayQ.first()
      .then((r) => {
        if (r) {
          fetch(r.get('json').url())
            .then(res => res.json())
            .then(d => {
              setData(d);
              setReplay(r);
            })
            .catch(error => {
              console.log(error);
              history.push('/visualize');
            });
        } else {
          history.push('/visualize');
        }
      });
  },[id, history]);

  return(
    <Box pad={{vertical: 'medium', horizontal: 'large'}} gap='medium'>
      {data && replay && (
        <DataViewer data={data} replay={replay}/>
      )}
    </Box>
  );
}
