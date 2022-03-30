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
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import libI18N from '../../lib/i18n';
import libTranslations from '../../lib/translations';
import libLocale from '../../lib/locale';
import getCatalogues from '../../lib/getCatalogues';

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

const Recommendations = () => {
    const localeES = 1;
    let [recommedations, setRecommendations] = useState([]);
    let [id, setId] = useState();
    let [name, setName] = useState('');
    let [i18nName, setI18nName] = useState();
    let [nameTranslation, setNameTranslation] = useState();
    let [description, setDescription] = useState('');
    let [i18nDescription, setI18nDescription] = useState();
    let [descriptionTranslation, setDescriptionTranslation] = useState();
    let [iconList, setIconList] = useState([])
    let [icon, setIcon] = useState();
    let [serviceTypeList, setServiceTypeList] = useState([]);
    let [serviceType, setServiceType] = useState();
    let [locale, setLocale] = useState();
    let [reloadData, setReloadData] = useState(false);

    const handleName = (event) => {
        setName(event.target.value);
    }

    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleOnChangeIcon = (event) => {
        setIcon(event.target.value);
    }

    const handleOnChangeServiceType = (event) => {
        setServiceType(event.target.value);
    }

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = recommedations.filter(
        item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const [openEdit, setOpenEdit] = useState(false);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleSumbitInsert = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const jsonData = {
            name: data.get('name'),
            i18nName: {
                id: await libI18N.insert()
            },
            i18nDescription: {
                id: await libI18N.insert()
            },
            icons: {
                id: (data.get('icon') !== '') ? data.get('icon') : "null"
            },
            serviceType: {
                id: data.get('serviceType')
            }
        }
        
        await axios.post('http://localhost:8080/api/recomendations/', jsonData)
            .then((response) => {
                if (response.data) {
                    libTranslations.insert(null, response.data.i18nName.id, localeES, data.get('name'));
                    if (data.get('description') !== '') {
                        libTranslations.insert(null, response.data.i18nDescription.id, localeES, data.get('description'));
                    }
                    event.target.reset();
                    setReloadData(true);
                } else {
                    console.log(response.data);
                }
            }).catch((error) => console.log(error));
    }

    const handleSumbitUpdate = async (event) => {
        event.preventDefault();
        let json = {
            id: id,
            name: name,
            i18nName: {
                id: i18nName
            },
            i18nDescription: {
                id: i18nDescription
            },
            icons: {
                id: (icon !== '') ? icon : null 
            },
            serviceType: {
                id: serviceType
            }
        }

        if (locale == 1) {
            await axios.post('http://localhost:8080/api/recomendations/', json)
                .then((response) => {
                    if (response.data) {
                        translations();
                    } else {
                        console.log(response.data);
                    }
                }).catch((error) => console.log(error));
        } else {
            translations();
        }

    }

    const handleButtonDelete = async (event) => {
        console.log(event);

        /*await axios.delete(`http://localhost:8080/api//${event.id}`)
          .then((res) => {
            (res.status == 202) ? setReloadData(true) : console.log(res);
          })
          .catch((error) => console.log(error));*/
    }

    const handleButtonClickLocale = async (event, column) => {
        let i18nName = event.i18nName.id;
        let i18nDesc = event.i18nDescription.id;
        setLocale(locale = await libLocale.get(column.name));
        setName('');
        setDescription('');
        setId(event.id);
        setI18nName(event.i18nName.id);
        setI18nDescription(event.i18nDescription.id);
        setIcon(event.icons.id);
        setServiceType(event.serviceType.id);
        setOpenEdit(true);

        const name = await libTranslations.getTranslation(i18nName, locale);
        const description = await libTranslations.getTranslation(i18nDesc, locale);
        (name.data.length > 0) ? (setName(name.data[0].text), setNameTranslation(name.data[0].id)) : (setName(''), setNameTranslation());
        (description.data.length > 0) ? (setDescription(description.data[0].text), setDescriptionTranslation(description.data[0].id)) : setDescriptionTranslation();

    }

    function translations() {
        libTranslations.insert(nameTranslation, i18nName, locale, name);
        libTranslations.insert(descriptionTranslation, i18nDescription, locale, description);

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
            name: 'Recommendation',
            selector: (row) => row.name,
        },
        {
            name: 'Service Type',
            selector: (row) => row.serviceType.nameIdentifier,
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
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} onFilterName={"Recommendation"} />
        );
    }, [filterText, resetPaginationToggle]);

    useEffect(() => {

        async function getAll() {
            await axios.get('http://localhost:8080/api/recomendations')
                .then((response) => {
                    if (response.data) {
                        let rows = response.data;

                        setRecommendations(recommedations = rows);
                        
                    } else {
                        console.log(response.data);
                    }
                }).catch((error) => console.log(error));
        }
        getAll();

        async function loadCatalogues() {
            setIconList(iconList = await getCatalogues.icons());
            setServiceTypeList(serviceTypeList = await getCatalogues.servicesType());
        }
        loadCatalogues();

        setReloadData(false);

    }, [reloadData]);

    return (

        <Layout title="Input">
            <Row center="xs">
                <Col breakPoint={{ xs: 12, md: 6 }}>
                    <form onSubmit={handleSumbitInsert}>
                        <Card>
                            <header>Add Recommendation</header>
                            <CardBody>
                                <Input>
                                    <input type="text" placeholder="Sandalias / Toalla..." name='name' required />
                                </Input>
                                <Input fullWidth>
                                    <input type="text" placeholder="" name='description' required />
                                </Input>
                                <Input>
                                    <Form.Select aria-label="Default select example" name="icon">
                                        <option value="">- Select -</option>
                                        {
                                            iconList.map((icon) => {
                                                return (
                                                    <option key={icon.id} value={icon.id}>{icon.icon}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Input>
                                <Input>
                                    <Form.Select aria-label="Default select example" name="serviceType">
                                        {
                                            serviceTypeList.map((serviceType) => {
                                                return (
                                                    <option key={serviceType.id} value={serviceType.id}>{serviceType.nameIdentifier}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
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
                        <header>Recommendations List</header>
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
                            <header>Edit Recommendation</header>
                            <CardBody>
                            <Input>
                                    <input type="text" placeholder="Sandalias / Toalla..." name='name' value={name} onChange={handleName} required />
                                </Input>
                                <Input fullWidth>
                                    <input type="text" placeholder="" name='description' value={description} onChange={handleDescription} required />
                                </Input>
                                <Input>
                                    <Form.Select aria-label="Default select example" name="icon" value={icon} onChange={handleOnChangeIcon}>
                                        <option value="">- Select -</option>
                                        {
                                            iconList.map((icon) => {
                                                return (
                                                    <option key={icon.id} value={icon.id}>{icon.icon}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Input>
                                <Input>
                                    <Form.Select aria-label="Default select example" name="serviceType" value={serviceType} onChange={handleOnChangeServiceType}>
                                        {
                                            serviceTypeList.map((serviceType) => {
                                                return (
                                                    <option key={serviceType.id} value={serviceType.id}>{serviceType.nameIdentifier}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
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
export default Recommendations;