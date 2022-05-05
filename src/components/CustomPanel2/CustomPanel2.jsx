import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { CustomPanel2Styles } from "./CustomPanel2.Styles";
import PatientInformationPane from "./Panes/PatientInformationPane/PatientInformationPane";
import CareManagementPane from "./Panes/CareManagementPane/CareManagementPane";
import TelehealthPane from "./Panes/TelehealthPane/TelehealthPane";
import {
  EDUCATION,
  EDUCATORS_QUEUE_NAME,
  INTAKE_BY_SCHEDULERS,
  SCHEDULERS_QUEUE_NAME,
  SCHEDULING,
  TRANSFER_TO_NURSE_EDUCATOR,
} from "../constants";
import { Grid, Typography } from "@material-ui/core";
import AppointmentSchedulingPane from "./Panes/AppointmentSchedulingPane/AppointmentSchedulingPane";
import { withTaskContext } from "@twilio/flex-ui";
import NoTasksPanel2 from "../NoTasksPanel2/NoTasksPanel2";
import PatientInteractionPane from "./Panes/PatientInteractionPane/PatientInteractionPane";
import PreventativeCarePane from "./Panes/PreventativeCarePane/PreventativeCarePane";
import { access } from "fs";

const hasAssignedTask = (tasks) => {
  for (let task of tasks) {
    const value = task[1];
    if (value.taskStatus === "assigned") return true;
  }
  return false;
};

const getAccessTokenInfo = (client_id, Token) =>
  fetch(`https://${process.env.REACT_APP_BACKEND_URL}/ehr-auth`, {
    method: "POST",
    body: new URLSearchParams({ client_id, Token }),
  }).then((resp) => resp.json());

// It is recommended to keep components stateless and use redux for managing states
const CustomPanel2 = (props) => {
  useEffect(() => {
    if (props.task) {
      try {
        const name = props.task.attributes?.name;

        //The task must have an associated name!
        if (!name) throw new Error();

        const names = name.split(" ");
        const first_name = names[0];
        const last_name = names[names.length - 1];

        props.fetchingFhirData();

        const Token = props.manager.user.token;
        const body = {
          Token,
        };

        //let client_id = localStorage.getItem("client_id");
        let client_id;
        if (!client_id) {
          console.log("HERE");
          (async () => {
            const client_id = await fetch(
              `https://${process.env.REACT_APP_BACKEND_URL}/register-ehr-client`,
              { method: "POST", body: new URLSearchParams(body) }
            )
              .then((resp) => resp.json())
              .then(({ client_id }) => {
                localStorage.setItem("client_id", client_id);
                return client_id;
              });

            //We must get a non null client_id
            if (!client_id) throw new Error();

            const access_token_info = await getAccessTokenInfo(
              client_id,
              Token
            );

            const patientResult = await fetch(
              `https://${process.env.REACT_APP_BACKEND_URL}/patient`,
              {
                method: "POST",
                body: new URLSearchParams({
                  access_token: access_token_info.access_token,
                  first_name,
                  last_name,
                  Token,
                }),
              }
            ).then((resp) => resp.json());

            const info = {
              accessTokenInfo: access_token_info,
              clientId: client_id,
              patientInfo: patientResult,
            };

            props.fetchingFhirDataSuccess(info);
          })();
        }
      } catch (err) {
        props.fetchingFhirDataFailure();
      }
    }
  }, [props.task]);

  const workerSkills = props.flexInfo.skills;
  const showTelehealth =
    props.manager.store.getState()["hls-emr"].videoButton.shouldShowTelehealth;
  const shouldShowTelehealth =
    process.env.REACT_APP_TELEHEALTH_URL && showTelehealth ? true : false;
  if (
    props &&
    props.tasks.size &&
    hasAssignedTask(props.tasks) &&
    props.task &&
    props.task.attributes &&
    props.task.workflowName
  ) {
    const timeStamps = {
      date: props.task.dateCreated.toDateString(),
      time: props.task.dateCreated.toTimeString(),
    };
    props.flex.TaskInfoPanel.Content.replace(
      <PatientInteractionPane
        key="PatientInteractionPane-component"
        timeStamps={timeStamps}
        workerSkill={workerSkills[0]}
      />,
      { sortOrder: -1 }
    );
    // if (props.task.workflowName === TRANSFER_TO_NURSE_EDUCATOR && workerSkills.includes(EDUCATION)) {
    if (true) {
      return (
        <CustomPanel2Styles>
          {/*{shouldShowTelehealth ?
              <Grid container spacing={16} grid-auto-rows={"1fr"}>
                <Grid item xs={12} sm={4}><CareManagementPane manager={props.manager}/></Grid>
                <Grid item xs={12} sm={8}><PatientInformationPane patientName={props.task.attributes.name} skill={EDUCATION}/></Grid>
                <Grid item xs={12} sm={4}><TelehealthPane nurseName={props.flexInfo.full_name}/></Grid>
                <Grid item xs={12} sm={8}><AppointmentSchedulingPane skill={EDUCATION}/></Grid>
              </Grid> :
              <Grid container spacing={16} grid-auto-rows={"1fr"}>
                <Grid item xs={12} sm={4}><CareManagementPane manager={props.manager}/></Grid>
                <Grid item xs={12} sm={8}><PatientInformationPane patientName={props.task.attributes.name} skill={EDUCATION}/></Grid>
                <Grid item xs={12} sm={12}><AppointmentSchedulingPane skill={EDUCATION}/></Grid>
              </Grid>
            }*/}
          <div className="flex-col">
            <Typography className="patient-info" component={"h1"}>
              <strong>{props.task.attributes.name}</strong>
            </Typography>
            <div className="flex-row">
              <CareManagementPane manager={props.manager} />
              <PatientInformationPane
                name={props.task.attributes.name}
                patientInfo={props.patientInfo}
                pendingRequest={props.isFhirRequestPending}
                skill={SCHEDULING}
              />
              {shouldShowTelehealth && (
                <TelehealthPane nurseName={props.flexInfo.full_name} />
              )}
            </div>
            <AppointmentSchedulingPane skill={EDUCATION} />
          </div>
        </CustomPanel2Styles>
      );
    } else if (
      props.task.workflowName === INTAKE_BY_SCHEDULERS &&
      workerSkills.includes(SCHEDULING)
    ) {
      return (
        <CustomPanel2Styles>
          <div className="flex-col">
            <Typography className="patient-info" component={"h1"}>
              <strong>{props.task.attributes.name}</strong>
            </Typography>
            <div className="flex-row">
              <PatientInformationPane
                name={props.task.attributes.name}
                patientInfo={props.patientInfo}
                pendingRequest={props.isFhirRequestPending}
                skill={SCHEDULING}
              />
              <PreventativeCarePane />
            </div>
            <AppointmentSchedulingPane />
          </div>
        </CustomPanel2Styles>
      );
    } else {
      throw new Error("Unknown Worker Skill!");
    }
  } else {
    return <NoTasksPanel2 />;
  }
};

CustomPanel2.displayName = "CustomPanel2";

CustomPanel2.propTypes = {
  shouldShowPanel: PropTypes.bool.isRequired,
  togglePanel: PropTypes.func.isRequired,
};

export default withTaskContext(CustomPanel2);
