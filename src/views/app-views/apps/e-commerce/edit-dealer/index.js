import React from 'react'
import CustomForm from '../Form'
import { useParams } from 'react-router-dom';
const EditDealer = () => {
    const params = useParams();
	return (
		<CustomForm mode="EDIT" param={params}/>
	)
}

export default EditDealer