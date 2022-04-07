import React from 'react';
import { Route, Redirect, useRouteMatch, useHistory, useLocation } from 'react-router-dom';

import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { PageLoader, PageError, Modal } from 'shared/components';

import NavbarLeft from './NavbarLeft';
import Sidebar from './Sidebar';
import Board from './Board';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import { ProjectPage } from './Styles';

const Project = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname.replace(/\/issue-(create|search)/, '');
  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/project');

  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { project } = data;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={() => history.push(`${path}/issue-search`)}
        issueCreateModalOpen={() => history.push(`${path}/issue-create`)}
      />

      <Sidebar project={project} />

      <Route path={`${match.url}/board`}>
        <Board
          project={project}
          fetchProject={fetchProject}
          updateLocalProjectIssues={updateLocalProjectIssues}
        />
      </Route>

      <Route path={`${match.url}/settings`}>
        <ProjectSettings project={project} fetchProject={fetchProject} />
      </Route>

      <Route path={`${path}/issue-search`}>
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={() => history.push(path)}
          renderContent={() => <IssueSearch project={project} />}
        />
      </Route>

      <Route path={`${path}/issue-create`}>
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={() => history.push(path)}
          renderContent={modal => (
            <IssueCreate
              project={project}
              fetchProject={fetchProject}
              onCreate={() => history.push(`${match.url}/board`)}
              modalClose={modal.close}
            />
          )}
        />
      </Route>

      {match.isExact && <Redirect to={`${match.url}/board`} />}
    </ProjectPage>
  );
};

export default Project;
