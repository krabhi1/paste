-- Custom SQL migration file, put your code below! --
UPDATE pastes SET syntax = 'markdown' WHERE syntax = 'plaintext';
