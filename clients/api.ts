import dayjs from 'dayjs';

const baseURL = 'https://theraponto.dev.thera.com.br:4433/api/';

export default class ApiClient {
  static authenticate = async () => {
    const userData = {
      userID: 'lucas.rezende@thera.com.br',
      accessKey: '123456',
      grantType: 'password',
    };

    const authResult = await fetch(`${baseURL}Accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return authResult.json();
  };

  static getAccessToken = async () => {
    if (sessionStorage.getItem('api_token')) {
      return sessionStorage.getItem('api_token');
    }
    const auth = await this.authenticate();
    sessionStorage.setItem('api_token', auth.accessToken);

    return auth.accessToken;
  };

  static createTimesheet = async () => {
    const accessToken = await this.getAccessToken();

    const timesheetResult = await fetch(`${baseURL}Timesheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return timesheetResult.json();
  };

  static updateTimesheet = async (id: number, action: string) => {
    const accessToken = await this.getAccessToken();

    const requestBody = {
      [action]: dayjs().toISOString(),
    };

    const timesheetResult = await fetch(`${baseURL}Timesheet/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    return true;
  };

  static getTimesheets = async () => {
    const accessToken = await this.getAccessToken();

    const timesheetResult = await fetch(`${baseURL}Timesheet/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const timesheetResultObj: any = await timesheetResult.json();

    return timesheetResultObj.items.map((item: any) => ({
      ...item,
      start: dayjs(item.start).add(3, 'hour').toISOString(),
    }));
  };
}
