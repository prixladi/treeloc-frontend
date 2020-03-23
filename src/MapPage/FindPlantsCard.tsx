import React, { Dispatch, SetStateAction } from 'react';
import { Slider, Row, Col, InputNumber } from 'antd';
import { SliderValue } from 'antd/lib/slider';

type Props = {
  distance: number | null;
  setDistance: Dispatch<SetStateAction<number | null>>;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
};

const distanceMarks = {
  1: '1 km',
  151: 'Neomezeno'
};

const countMarks = {
  1: '1',
  8000: '8000'
};

export const FindPlantsCard = ({
  distance,
  setDistance,
  count,
  setCount
}: Props) => {
  return (
    <>
      <h2>Hledání dřevin</h2>
      <Row style={{marginBottom:"1em"}}>
        <h4>Maximální vzdálenost</h4>
        <Col span={14}>
          <Slider
            min={1}
            max={151}
            onChange={(value: SliderValue) =>
              setDistance(value < 151 ? (value as number) : null)
            }
            value={distance || 151}
            marks={distanceMarks}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={1}
            max={150}
            style={{ marginLeft: "3em" }}
            value={distance || undefined}
            onChange={(value: number | undefined) =>
              setDistance(value as number)
            }
          />
        </Col>
      </Row>
      <Row>
        <h4>Maximální počet dřevin</h4>
        <Col span={14}>
          <Slider
            min={1}
            max={8000}
            onChange={(value: SliderValue) => setCount(value as number)}
            value={count}
            marks={countMarks}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={1}
            max={8000}
            style={{ marginLeft: "3em" }}
            value={count}
            onChange={(value: number | undefined) => setCount(value as number)}
          />
        </Col>
      </Row>
    </>
  );
};
