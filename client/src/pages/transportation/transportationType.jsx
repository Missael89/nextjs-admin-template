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
import libI18N from '../../lib/i18n';
import libTranslations from '../../lib/translations';
import libLocale from '../../lib/locale';

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

const styleActionButtonModal = {
  marginRight: '20px'
}

const TransportationType = () => {
  let [transporationType, setTransporationType] = useState([]);
  let [id, setId] = useState();
  let [name, setName] = useState('');
  let [i18nName, setI18nName] = useState();
  let [nameTranslation, setNameTranslation] = useState();
  let [locale, setLocale] = useState();
  let [reloadData, setReloadData] = useState(false);

  const handleName = (event) => {
    setName(event.target.value);
  }

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = transporationType.filter(
    item => item[5] && item[5].toLowerCase().includes(filterText.toLowerCase()),
  );

  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);

  const handleSumbitInsert = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      i18nName: {
        id: await libI18N.insert()
      }
    }

    await axios.post('http://localhost:8080/api/transportationType/', jsonData)
      .then((response) => {
        if (response.data) {
          libTranslations.insert(null, response.data.i18nName.id, 1, data.get('name'));
          event.target.reset();
          setReloadData(true);
        } else {
          console.log(response.data);
        }
      }).catch((error) => console.log(error));
    
  }

  const handleSumbitUpdate = async (event) => {
    event.preventDefault();
    translations();
    setReloadData(true);
  }

  const handleButtonDelete = async (event) => {
    console.log(event);
  }

  const handleButtonClickLocale = async (event, column) => {
    let i18nName = event[3];
    setLocale(locale = await libLocale.get(column.name));
    setName('');
    setId(event[0]);
    setI18nName(event[1]);
    setOpenEdit(true);

    setName(event[5]);

    /* Get Traduction */
    const name = await libTranslations.getTranslation(i18nName, locale);

    if(name.data.length > 0) {
      (setName(name.data[0].text), setNameTranslation(name.data[0].id))
    } else {
      (setName(''), setNameTranslation());
    }

  }

  function translations() {
    libTranslations.insert(nameTranslation, i18nName, locale, name);
    setOpenEdit(false);
    setReloadData(true);
  }

  const columns = useMemo(() => [
    {
      cell: (row, index, column, id) => <Button onClick={() => { handleButtonClickLocale(row, column) }} data-tag="allowRowEvents">Español</Button>,
      allowOverflow: true,
      button: true,
      width: "150px",
      name: "ES"
    },
    {
      cell: (row, index, column, id) => <Button onClick={() => { handleButtonClickLocale(row, column) }} data-tag="allowRowEvents">English</Button>,
      allowOverflow: true,
      button: true,
      width: "150px",
      name: "EN"
    },
    {
      cell: (row) => <Button status="Danger" onClick={() => handleButtonDelete(row)} data-tag="allowRowEvents">Delete</Button>,
      allowOverflow: true,
      button: true,
      width: "150px"
    },
    {
      name: 'Car Rental Type',
      selector: (row) => row[5],
    }
  ], []);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} onFilterName={"Car Rental Type"} />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {

    async function getAll() {
      await axios.get('http://localhost:8080/api/getTransportationType')
        .then((response) => {
          if (response.data) {
            let rows = response.data;

            setTransporationType(transporationType = rows);

          } else {
            console.log(response.data);
          }
        }).catch((error) => console.log(error));
    }
    getAll();

    setReloadData(false);

  }, [reloadData]);

  return (

    <Layout title="Input">
      <Row center="xs">
        <Col breakPoint={{ xs: 12, md: 6 }}>
          <form onSubmit={handleSumbitInsert}>
            <Card>
              <header>Add Transportation Type</header>
              <CardBody>
                <Input fullWidth>
                  <input type="text" placeholder="Familiar / Luxury / Standar" name='name' id='name' required />
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
            <header>Transportation Type List</header>
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
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSumbitUpdate}>
            <Card>
              <header>Edit Transportation Type</header>
              <CardBody>
                <Input fullWidth>
                  <input type="text" placeholder="" name='name' value={name} onChange={handleName} required />
                </Input>
              </CardBody>
              <CardFooter>
                <Button appearance={`outline`} status="Success" type="submit" style={styleActionButtonModal}>
                  Save
                </Button>
                <Button appearance={`outline`} status="Warning" type="button" onClick={handleCloseEdit}>
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Box>
      </Modal>

    </Layout>

  );
};
export default TransportationType;