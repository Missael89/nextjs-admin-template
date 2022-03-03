import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { InputGroup } from '@paljs/ui/Input';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import { Button } from '@paljs/ui/Button';
import styled from 'styled-components';
import Layout from 'Layouts';
import DataTable from 'react-data-table-component';
import FilterComponent from '../extra-components/FilterComponent';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import axios from 'axios';

const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
};

const Locale = () => {

  let [locales, setLocales] = useState([]);
  let [localeId, setLocaleId] = useState();
  let [localeCode, setLocaleCode] = useState('');
  let [localeName, setLocaleName] = useState('');
  let [reloadData, setReloadData] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = locales.filter(
    item => item.language && item.language.toLowerCase().includes(filterText.toLowerCase()),
  );

  const [open, setOpen] = useState(false);
  //const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleButtonClick = (event) => {
    setLocaleId(event.id);
    setLocaleCode(event.code);
    setLocaleName(event.language);
    setOpen(true)
  }

  const handleButtonDelete = async (event) => {

    await axios.delete(`http://localhost:8080/api/locale/${event.id}`)
      .then((res) => {
        (res.status == 202) ? setReloadData(true) : console.log(res);
      })
      .catch((error) => console.log(error));
  }

  const handleSumbit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      code: data.get('code'),
      language: data.get('language')
    }

    console.log(jsonData);

    await axios.post('http://localhost:8080/api/locale/', jsonData)
      .then((response) => {
        if (response.data) {
          event.target.reset();
          setReloadData(true);
        } else {
          console.log(response.data);
        }
      }).catch((error) => console.log(error));
  }

  const handleSumbitUpdate = async (event) => {
    event.preventDefault();
    const jsonData = {
      id: localeId,
      code: localeCode,
      language: localeName
    }

    console.log(jsonData);

    await axios.post('http://localhost:8080/api/locale/', jsonData)
      .then((response) => {
        if (response.data) {
          setOpen(false);
          setReloadData(true);
        } else {
          console.log(response.data);
        }
      }).catch((error) => console.log(error));
  }

  const handleLocationCode = (event) => {
    setLocaleCode(event.target.value);
  }

  const handleLocationName = (event) => {
    setLocaleName(event.target.value);
  }

  const columns = useMemo(() => [
    {
      cell: (row) => <Button onClick={() => handleButtonClick(row)} data-tag="allowRowEvents" id={row.id}>Edit</Button>,
      allowOverflow: true,
      button: true,
      width: "150px"
    },
    {
      cell: (row) => <Button status="Danger" onClick={() => handleButtonDelete(row)} data-tag="allowRowEvents" id={row.id}>Delete</Button>,
      allowOverflow: true,
      button: true,
      width: "150px"
    },
    {
      name: 'Code',
      selector: (row) => row.code,
    },
    {
      name: 'Language',
      selector: (row) => row.language,
    },
  ], []);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} onFilterName={"Language"} />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {

    async function getAllLocations() {
      await axios.get('http://localhost:8080/api/locale/')
        .then((response) => {
          if (response.data) {
            let rows = response.data;

            setLocales(locales = rows);

            /*rows.map((row, idx) => {
              console.log(idx, row);
            });*/

          } else {
            console.log(response.data);
          }
        }).catch((error) => console.log(error));
    }
    getAllLocations();


    setReloadData(false);

  }, [reloadData]);

  return (

    <Layout title="Input">
      <Row center="xs">
        <Col breakPoint={{ xs: 12, md: 6 }}>
          <form onSubmit={handleSumbit}>
            <Card>
              <header>Add Language</header>
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
            <header>Languages List</header>
            <CardBody>
              <DataTable
                columns={columns}
                data={filteredItems}
                striped
                pagination
                responsive
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                onRowClicked={(row) => { console.log(row) }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSumbitUpdate}>
            <Card>
              <header>Edit Language</header>
              <CardBody>
                <Input size="Small">
                  <input type="text" placeholder="Code: ES" name='code' value={localeCode} onChange={handleLocationCode} required />
                </Input>
                <Input fullWidth size="Small">
                  <input type="text" placeholder="Language: Español" name='language' value={localeName} onChange={handleLocationName} required />
                </Input>
              </CardBody>
              <CardFooter>
                <Button appearance={`outline`} status="Success" type="submit">
                  Save
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Box>
      </Modal>

    </Layout>

  );
};
export default Locale;