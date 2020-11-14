import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Switch from "react-switch";


const SwitchButton = ({ innerRef, onChange, label, defaultChecked, disabled, value }) => {



	const [swtichStatus, setSwitchStatus] = useState(defaultChecked);

	useEffect(() => {
		innerRef.current = {checked : (defaultChecked ? true : false)};
		setSwitchStatus(innerRef.current.checked)
	}, [defaultChecked, innerRef])

	useEffect(() => {
		if (value === true || value === false) {
			setSwitchStatus(value);
		}
	}, [value])

	const onSwitchChanged = useCallback( (newStatus) => {
		innerRef.current = {checked: newStatus};
		setSwitchStatus(newStatus);
		if (onChange) onChange(newStatus);
	}, [innerRef, setSwitchStatus, onChange])

	return <Row className="no-gutters">
		<Col sm="auto">
			<Switch
				checked={swtichStatus}
				onChange={onSwitchChanged}
				checkedIcon={false}
				uncheckedIcon={false}
				height={14}
				width={32}
				handleDiameter={17}
				offColor="#ddd"
				onColor="#cce5ff"
				offHandleColor="#999"
				onHandleColor="#007bff"
				className="mt-2"
				disabled={disabled}
			/>
		</Col>
		<Col sm="auto" className="mt-1 ml-3">
			{label}
		</Col>
	</Row>
}

export default SwitchButton;