import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'welcome',
    'roadmap',
    {
      type: 'category',
      label: 'Get Started',
      items: [
        'get-started/overview',
        'get-started/environment',
        'get-started/installation'
      ],
    },
    {
      type: 'category',
      label: 'Try, Install or Upgrade',
      items: [
        'try-install-upgrade/try',
        'try-install-upgrade/install',
        {
          type: 'category',
          label: 'Docker Compose',
          items: [
            'try-install-upgrade/docker-compose/install',
            'try-install-upgrade/docker-compose/configure'
          ],
        },
        {
          type: 'category',
          label: 'Sample Data',
          items: [
            'try-install-upgrade/sample-data/overview',
            {
              type: 'category',
              label: 'Shane Longman',
              items: [
                'try-install-upgrade/sample-data/shane-longman/overview',
                'try-install-upgrade/sample-data/shane-longman/user-provisioning'
              ],
            }
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'Build with AI',
      items: [
        {
          type: 'category',
          label: 'Harness Engineering',
          items: [
            'build-with-ai/harness-engineering/overview'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Developer Guide',
      items: [
        'developer-guide/overview',
        {
          type: 'category',
          label: 'Angular',
          items: [
            'developer-guide/angular/overview',
            'developer-guide/angular/configure',
            'developer-guide/angular/quickstart'
          ],
        },
        {
          type: 'category',
          label: 'Camunda',
          items: [
            'developer-guide/camunda/overview',
            'developer-guide/camunda/quickstart'
          ],
        },
        'developer-guide/common-data-model',
        {
          type: 'category',
          label: 'Database Seeds',
          items: [
            'developer-guide/database-seeds/parliament-of-australia/parliament-of-australia'
          ],
        },
        {
          type: 'category',
          label: 'Spring Boot',
          items: [
            'developer-guide/spring-boot/overview',
            'developer-guide/spring-boot/quickstart'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/authentication',
        'concepts/cqrs'
      ],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        {
          type: 'category',
          label: 'Backend for Frontend',
          items: [
            'components/bff/overview',
            'components/bff/configuration'
          ],
        },
        {
          type: 'category',
          label: 'Progressive Web App',
          items: [
            'components/pwa/overview',
            'components/pwa/configuration'
          ],
        },
        {
          type: 'category',
          label: 'Nginx',
          items: [
            'components/nginx/overview',
            'components/nginx/configuration'
          ],
        },
        {
          type: 'category',
          label: 'Party Service',
          items: [
            'components/party-service/overview'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Architecture Guide',
      items: [
        'architecture-guide/overview',
        {
          type: 'category',
          label: 'Identity',
          items: [
            'architecture-guide/identity/overview'
          ],
        },
        {
          type: 'category',
          label: 'Access Control',
          items: [
            'architecture-guide/access-control/overview',
            'architecture-guide/access-control/design-document'
          ],
        },
        {
          type: 'category',
          label: 'Observability',
          items: [
            'architecture-guide/observability/overview',
            'architecture-guide/observability/design-document'
          ],
        },
        {
          type: 'category',
          label: 'Party Service',
          items: [
            'architecture-guide/party-service/design-document'
          ],
        },
        {
          type: 'category',
          label: 'ADR',
          items: [
            'architecture-guide/adr/overview',
            'architecture-guide/adr/adr-0001-bff-oauth2-confidential-client',
            'architecture-guide/adr/adr-0002-soft-delete-party-entities',
            'architecture-guide/adr/adr-0003-bff-cors-csrf-session-security'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Administration Guide',
      items: [
        'administration-guide/docker',
        'administration-guide/keycloak',
        'administration-guide/pgadmin',
        'administration-guide/postgres',
        'administration-guide/rate-limiting'
      ],
    },
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'user-guide/learn-the-basics',
        'user-guide/orchestrate-human-tasks'
      ],
    },
    {
      type: 'category',
      label: 'References',
      items: [
        'references/case-management'
      ],
    },
  ],
};

export default sidebars;
