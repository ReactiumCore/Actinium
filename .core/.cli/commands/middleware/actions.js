export default (spinner) => {
    const { chalk } = arcli;

    const message = (text) => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: ({ action, params, props }) => {
            message(`Creating ${chalk.cyan('middleware')}...`);
        },
    };
};
