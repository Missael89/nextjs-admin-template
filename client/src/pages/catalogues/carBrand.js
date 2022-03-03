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

const CarBrand = () => {
    let [carBrand, setCarBrand] = useState([]);
    let [carBrandId, setCarBrandId] = useState();
    let [carBrandName, setCarBrandName] = useState('');
    let [reloadData, setReloadData] = useState(false);

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = carBrand.filter(
        item => item.brand && item.brand.toLowerCase().includes(filterText.toLowerCase()),
    );

    const handleSumbit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const jsonData = {
            brand: data.get('brand')
        }

        await axios.post('http://localhost:8080/api/carBrand/', jsonData)
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
            id: carBrandId,
            brand: carBrandName
        }

        await axios.post('http://localhost:8080/api/carBrand/', jsonData)
            .then((response) => {
                if (response.data) {
                    setOpen(false);
                    setReloadData(true);
                } else {
                    console.log(response.data);
                }
            }).catch((error) => console.log(error));
    }

    const handleButtonClick = (event) => {
        setCarBrandId(carBrandId = event.id);
        setCarBrandName(carBrandName = event.brand);
        setOpen(true);
    }

    const handleButtonDelete = async (event) => {
        await axios.delete(`http://localhost:8080/api/carBrand/${event.id}`)
            .then((res) => {
                (res.status == 202) ? setReloadData(true) : console.log(res);
            })
            .catch((error) => console.log(error));
    }

    const handleCarBrandName = (event) => {
        setCarBrandName(event.target.value);
    }

    const columns = useMemo(() => [
        {
            cell: (row) => <Button onClick={() => handleButtonClick(row)} data-tag="allowRowEvents">Edit</Button>,
            allowOverflow: true,
            button: true,
            width: "150px"
        },
        {
            cell: (row) => <Button status="Danger" onClick={() => handleButtonDelete(row)} data-tag="allowRowEvents">Delete</Button>,
            allowOverflow: true,
            button: true,
            width: "150px"
        },
        {
            name: 'Brand',
            selector: (row) => row.brand,
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
            <FilterComponent onFilter={(e) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} onFilterName={"Language"} />
        );
    }, [filterText, resetPaginationToggle]);

    useEffect(() => {

        async function getAll() {
            await axios.get('http://localhost:8080/api/carBrand/')
                .then((response) => {
                    if (response.data) {
                        let rows = response.data;
                        setCarBrand(carBrand = rows);
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
                    <form onSubmit={handleSumbit}>
                        <Card>
                            <header>Add Car Brand</header>
                            <CardBody>
                                <Input fullWidth size="Small">
                                    <input type="text" placeholder="Audi" name='brand' required />
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
                        <header>Car Brand List</header>
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
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={handleSumbitUpdate}>
                        <Card>
                            <header>Car Brand Edit</header>
                            <CardBody>
                                <Input fullWidth size="Small">
                                    <input type="text" placeholder="" name='brand' value={carBrandName} onChange={handleCarBrandName} required />
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
export default CarBrand;