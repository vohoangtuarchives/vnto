import api from './api';

class ConfigurationService {
    async getDefaultConfigurations(){
        return api.get('/settings/configurations/default');
    }
}

export default new ConfigurationService();
