import { useState } from "react";

import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal, Button } from "react-bootstrap";

import Sidebar from "../components/Sidebar";
import Widget from "../components/Widget";

const columns = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "TITLE",
    field: "title",
  },
  {
    title: "DESCRIPTION",
    field: "description",
  },
  {
    title: "ASIGNEE",
    field: "asignee",
  },
  {
    title: "PRIORITY",
    field: "ticketPriority",
  },
  {
    title: "STATUS",
    field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];

function Customer() {
    const [createTicketModal, setCreateTicketModal] = useState(false); 

  return (
    <div className="bg-light vh-100">
      <Sidebar />
      <div className="container pt-5">
        <h3 className="text-center text-success">Welcome, Customer!</h3>
        <p className="text-center text-muted">
          Take a look at all your tickets below!
        </p>
        {/* color, title, icon, ticketCount, pathColor  */}
        <div className="row">
          <Widget
            color="primary"
            title="OPEN"
            icon="envelope-open"
            ticketCount={8}
            pathColor="darkblue"
          />
          <Widget
            color="warning"
            title="PROGRESS"
            icon="hourglass-split"
            ticketCount={2}
            pathColor="darkyellow"
          />
          <Widget
            color="success"
            title="CLOSED"
            icon="check2-circle"
            ticketCount={82}
            pathColor="darkolivegreen"
          />
          <Widget
            color="secondary"
            title="BLOCKED"
            icon="slash-circle"
            ticketCount={2}
            pathColor="darkgrey"
          />
        </div>
        <hr />
        <MaterialTable title="TICKETS RAISED BY YOU" 
        columns={columns}
        options={{
            filtering: true, 
            headerStyle: {
                backgroundColor: '#288859', 
                color: "#fff"
            }, 
            rowStyle: {
                backgroundColor: '#eee'
            }, 
            exportMenu: [
                {
                    label: "Export Pdf", 
                    exportFunc: (cols, datas) => ExportPdf(cols, datas, "Ticket Records")
                }, 
                {
                    label: "Export Csv", 
                    exportFunc: (cols, datas) => ExportCsv(cols, datas, "Ticket Records")
                }
            ]
        }}
        />
        <hr />
        <h4 className="text-center ">Facing any issues? Raise a ticket!</h4>
        <button className="btn btn-lg btn-success form-control" onClick={()=> setCreateTicketModal(true)}>Raise Ticket</button>

        {
            createTicketModal ? (
                <Modal 
                show={createTicketModal}
                backdrop="static"
                centered
                onHide={()=> setCreateTicketModal(false)}>

                    <Modal.Header closeButton>
                        Create a new Ticket
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="input-group m-1">
                                <label className="label label-md input-group-text">TITLE</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="input-group m-1">
                                <label className="label label-md input-group-text">DESCRIPTION</label>
                                <textarea type="text" className=' md-textarea form-control' rows="3" name="description" />
                            </div>

                            <div className="d-flex justify-content-end">
<Button variant="secondary" className="m-1" onClick={()=>setCreateTicketModal(false) }>Cancel</Button>
<Button variant="success" className="m-1" type="submit">Create</Button>

                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            ) : null
        }
      </div>
    </div>
  );
}

export default Customer;
