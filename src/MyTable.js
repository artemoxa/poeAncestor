import React from 'react';
import Table from 'react-bootstrap/Table';

function MyTable({ data }) {
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Name</th>
                <th>Chaos Value</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.chaosValue}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}

export default MyTable;
