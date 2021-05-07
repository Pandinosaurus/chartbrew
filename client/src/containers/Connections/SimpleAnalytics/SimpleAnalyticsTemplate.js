import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Segment, Form, Button, Icon, Header, Label, Message, Container, Divider, List,
} from "semantic-ui-react";

import { generateDashboard } from "../../../actions/connection";

/*
  The Form used to configure the SimpleAnalytics template
*/
function SimpleAnalyticsTemplate(props) {
  const {
    teamId, projectId, addError, onComplete,
  } = props;

  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState({});
  const [errors, setErrors] = useState({});
  const [notPublic, setNotPublic] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const _onGenerateDashboard = () => {
    setErrors({});

    if (!connection.website || connection.website.length > 24) {
      setTimeout(() => {
        setErrors({ ...errors, website: "Please enter your website" });
      }, 100);
      return;
    }

    const data = { ...connection, team_id: teamId };
    setLoading(true);
    setNotPublic(false);
    setNotFound(false);

    generateDashboard(projectId, data, "simpleanalytics")
      .then(() => {
        setTimeout(() => {
          onComplete();
        }, 2000);
      })
      .catch((err) => {
        if (err && err.message === "403") setNotPublic(true);
        if (err && err.message === "404") setNotFound(true);
        setLoading(false);
      });
  };

  return (
    <div style={styles.container}>
      <Segment style={styles.mainSegment}>
        <Header as="h3" style={{ marginBottom: 20 }}>
          Configure the template
        </Header>

        <div style={styles.formStyle}>
          <Form>
            <Form.Field error={!!errors.name} required>
              <label>Enter your Simple Analytics website</label>
              <Form.Input
                placeholder="chartbrew.com"
                value={connection.website || ""}
                onChange={(e, data) => {
                  setConnection({ ...connection, website: data.value });
                }}
              />
              {errors.website
                && (
                  <Label basic color="red" pointing>
                    {errors.website}
                  </Label>
                )}
            </Form.Field>

            <Form.Field>
              <label>
                {"Enter your Simple Analytics API key (if the website is private). "}
                <a href="https://simpleanalytics.com/account#api" target="_blank" rel="noreferrer">
                  {"Get your API key here "}
                  <Icon name="external" />
                </a>
              </label>
              <Form.Input
                placeholder="sa_api_key_*"
                value={connection.apiKey || ""}
                onChange={(e, data) => {
                  setConnection({ ...connection, apiKey: data.value });
                }}
              />
            </Form.Field>
            {notPublic && (
              <Form.Field>
                <Message negative>
                  <Message.Header>{"Your site appears to be set to private"}</Message.Header>
                  <div>
                    <p>{"In order to be able to get the stats from Simple Analytics, please do one of the following:"}</p>
                    <List bulleted>
                      <List.Item>
                        {"Enter your Simple Analytics API key in the field above. "}
                        <a href="https://simpleanalytics.com/account#api" target="_blank" rel="noreferrer">
                          {"Click here to find your API key. "}
                          <Icon name="external" />
                        </a>
                      </List.Item>
                      <List.Item>
                        {"Alternatively, "}
                        <a href={`https://simpleanalytics.com/${connection.website}/settings#visibility`} target="_blank" rel="noreferrer">
                          {"make your site stats public here. "}
                          <Icon name="external" />
                        </a>
                      </List.Item>
                    </List>
                  </div>
                </Message>
              </Form.Field>
            )}

            {notFound && (
              <Form.Field>
                <Message negative>
                  <Message.Header>{"Your site could not be found"}</Message.Header>
                  <div>
                    <p>{"Make sure your website is spelt correctly and that it is registered with Simple Analytics."}</p>
                    <p>
                      {"You can check if it exists here: "}
                      <a href={`https://simpleanalytics.com/${connection.website}`} target="_blank" rel="noreferrer">
                        {`https://simpleanalytics.com/${connection.website} `}
                        <Icon name="external" />
                      </a>
                    </p>
                  </div>
                </Message>
              </Form.Field>
            )}
          </Form>
        </div>

        {addError
          && (
            <Message negative>
              <Message.Header>{"Server error while trying to save your connection"}</Message.Header>
              <p>Please try adding your connection again.</p>
            </Message>
          )}

        <Divider hidden />
        <Container fluid textAlign="right">
          <Button
            primary
            loading={loading}
            onClick={_onGenerateDashboard}
            icon
            labelPosition="right"
            style={styles.saveBtn}
          >
            <Icon name="magic" />
            Create your dashboard
          </Button>
        </Container>
      </Segment>
    </div>
  );
}
const styles = {
  container: {
    flex: 1,
  },
  mainSegment: {
    padding: 20,
  },
  formStyle: {
    marginTop: 20,
    marginBottom: 20,
  },
  saveBtn: {
    marginRight: 0,
  },
};

SimpleAnalyticsTemplate.defaultProps = {
  addError: null,
};

SimpleAnalyticsTemplate.propTypes = {
  teamId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  addError: PropTypes.bool,
};

export default SimpleAnalyticsTemplate;