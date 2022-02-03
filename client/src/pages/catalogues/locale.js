import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { InputGroup } from '@paljs/ui/Input';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import { Button } from '@paljs/ui/Button';
import styled from 'styled-components';
import Layout from 'Layouts';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;


const Locale = () => {
  let [locales, setLocales] = useState([]);
  let [reloadData, setReloadData] = useState(false);

  const handleButtonClick = (event) => {
    console.log(event.target.id);
  }

  const handleSumbit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.append('query', 'insert');
    const id = data.get('id');
    const code = data.get('code');
    const language = data.get('language');
    const query = data.get('query');

    axios.post('http://localhost:3001/api/locale', { id, code, language, query }).then((response) => {
      if (response.data.success) {
        event.target.reset();
        alert(response.data.message);
        setReloadData(true);
      } else {
        alert(response.data.error_msg);
        console.log(response.data);
      }
    }).catch((error) => console.log(error));
  }

  const columns = useMemo(() => [
    {
      cell: (row) => <Button onClick={handleButtonClick} data-tag="allowRowEvents" id={row.ID}>Edit</Button>,
      allowOverflow: true,
      button: true,
      width: "150px"
    },
    {
      cell: (row) => <Button status="Danger" onClick={handleButtonClick} data-tag="allowRowEvents" id={row.ID}>Delete</Button>,
      allowOverflow: true,
      button: true,
      width: "150px"
    },
    {
      name: 'Code',
      selector: (row) => row.CODE,
    },
    {
      name: 'Language',
      selector: (row) => row.LANGUAGE,
    },
  ], []);

  useEffect(() => {

    function loadLocationData() {
      axios.post('http://localhost:3001/api/locale', { query: 'select' }).then((response) => {
        if (response.data.success) {
          let rows = response.data.result;
          
          setLocales(locales = rows);

          /*rows.map((row: any, idx: number) => {
            console.log(idx, row);
          })*/

        } else {
          alert(response.data.error_msg);
          console.log(response.data);
        }
      }).catch((error) => console.log(error));
    }
    loadLocationData();


    setReloadData(false);

  }, [reloadData]);

  return (

    <Layout title="Input">
      <Row center="xs">
        <Col breakPoint={{ xs: 12, md: 6 }}>
          <form onSubmit={handleSumbit}>
            <Card>
              <header>Agregar Idioma</header>
              <CardBody>
                <Input size="Small">
                  <input type="text" placeholder="Code: ES" name='code' id='code' required />
                </Input>
                <Input fullWidth size="Small">
                  <input type="text" placeholder="Language: Español" name='language' id='language' required />
                </Input>
              </CardBody>
              <CardFooter>
                <Button appearance={`outline`} status="Success" type="submit">
                  Add
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Col>
      </Row>
      <Row>
        <Col breakPoint={{ xs: 12 }}>
          <Card>
            <header>Lista de Idiomas</header>
            <CardBody>
              <DataTable
                columns={columns}
                data={locales}
                striped
                pagination
                responsive
                onRowClicked={(row) => { console.log(row) }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Layout>

  );
};
export default Locale;