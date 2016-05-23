/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from 'angular2/core';
import {ContentActionModel} from './../models/content-action.model';
import {ContentActionList} from './content-action-list';
import {DocumentActionsService} from '../services/document-actions.service';
import {FolderActionsService} from '../services/folder-actions.service';
import {ContentActionHandler} from '../models/content-action.model';

@Component({
    selector: 'content-action',
    template: ''
})
export class ContentAction implements OnInit, OnChanges {

    @Input()
    title: string = 'Action';

    @Input()
    icon: string;

    @Input()
    handler: string;

    @Input()
    type: string;

    @Input()
    target: string;

    @Output()
    execute = new EventEmitter();

    model: ContentActionModel;

    constructor(
        private list: ContentActionList,
        private documentActions: DocumentActionsService,
        private folderActions: FolderActionsService) {
        this.model = new ContentActionModel();
    }

    ngOnInit() {
        this.model = new ContentActionModel({
            type: this.type,
            title: this.title,
            icon: this.icon,
            target: this.target
        });

        if (this.handler) {
            this.model.handler = this.getSystemHandler(this.target, this.handler);
        } else if (this.execute) {
            this.model.handler = (document: any): void => {
                this.execute.emit({
                    value: document
                });
            };
        }

        this.list.registerAction(this.model);
    }

    ngOnChanges() {
        // update localizable properties
        this.model.title = this.title;
    }

    private getSystemHandler(target: string, name: string): ContentActionHandler {
        if (target) {
            let ltarget = target.toLowerCase();

            if (ltarget === 'document') {
                if (this.documentActions) {
                    return this.documentActions.getHandler(name);
                }
                return null;
            }

            if (ltarget === 'folder') {
                if (this.folderActions) {
                    return this.folderActions.getHandler(name);
                }
                return null;
            }
        }
        return null;
    }
}
