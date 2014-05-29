##############################################################
##                    COPYRIGHT NOTICE
##
##  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and
##  contributors. All rights reserved
##
##  This program is free software: you can redistribute it and/or modify
##  it under the terms of the GNU Lesser General Public License as published
##  by the Free Software Foundation, either version 3 of the License, or
##  (at your option) any later version.
##
##  This program is distributed in the hope that it will be useful,
##  but WITHOUT ANY WARRANTY; without even the implied warranty of
##  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
##  GNU Lesser General Public License for more details.
##
##  You should have received a copy of the GNU Lesser General Public License
##  along with this program. If not, see <http://www.gnu.org/licenses/>.
##############################################################

###                     Declaration
##############################################################

SHELL = /bin/sh
CHMOD = chmod
CP = cp
CD = cd
XTEMP = ../tools/manage_template.sh
MV = mv
NOOP = $(SHELL) -c true
RM_F = rm -f
RM_RF = rm -rf
TEST_F = test -f
TOUCH = touch
UMASK_NULL = umask 0
DEV_NULL = > /dev/null 2>&1
MKPATH = mkdir -p
CAT = cat
MAKE = make
OPEN = open
ECHO = echo
ECHO_N = echo -n
JAVA = java
export TOOLS_PATH = /Users/dthevenin/ViniSketch/Sources/VSToolkit/tools/ext
COMPILE = $(JAVA) -jar $(TOOLS_PATH)/closurecompiler/compiler.jar --language_in=ECMASCRIPT5
COMPILE_ADV = $(JAVA) -jar $(TOOLS_PATH)/closurecompiler/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS
COMPILE_YUI = $(JAVA) -cp $(TOOLS_PATH)/yuicompressor/jargs-1.0.jar:$(TOOLS_PATH)/yuicompressor/rhino-1.6R7.jar -jar $(TOOLS_PATH)/yuicompressor/yuicompressor-2.4.8.jar
GENDOC = $(JAVA) -jar $(TOOLS_PATH)/jsdoc-toolkit/jsrun.jar $(TOOLS_PATH)/jsdoc-toolkit/app/run.js
COMPILE_LESS = /usr/local/bin/lessc

###                         RELEASE
##############################################################

all :: release

Debug :: debug
Release :: release

release :: clean vs_webcomponent.js vs_events.js vs_gl_engine.js
	-$(MV) vs_gl_engine.js vs_gl_engine_tmp.js
	-$(COMPILE) --js=vs_gl_engine_tmp.js --js_output_file=vs_gl_engine.js
	-$(RM_F) vs_gl_engine_tmp.js

debug :: clean vs_webcomponent.js vs_events.js vs_gl_engine.js

clean ::
	-$(RM_RF) vs_webcomponent.js
	-$(RM_RF) vs_events.js
	-$(RM_RF) vs_gl_engine.js

vs_webcomponent.js:
	$(CAT) customElement/polymer/Scope.js >> $@
	$(CAT) customElement/polymer/Boot.js >> $@
	$(CAT) customElement/polymer/Observer.js >> $@
	$(CAT) customElement/polymer/Parser.js >> $@
	$(CAT) customElement/polymer/CustomElements.js >> $@
	$(CAT) customElement/CustomElement.js >> $@

vs_events.js:
	$(CAT) Events/GLPicking.js >> $@
	$(CAT) Events/GLPointerEvent.js >> $@
	$(CAT) Events/MouseEvent.js >> $@
	$(CAT) Events/TouchEvent.js >> $@
	$(CAT) Events/PointerEvent.js >> $@
	$(CAT) Events/Recognizers/DragRecognizer.js >> $@
	$(CAT) Events/Recognizers/PinchRecognizer.js >> $@
	$(CAT) Events/Recognizers/RotationRecognizer.js >> $@
	$(CAT) Events/Recognizers/TapRecognizer.js >> $@
	
vs_gl_engine.js:	
	$(CAT) glMatrix.js >> $@
#	$(CAT) vsUIExtentions.js >> $@
	$(CAT) webGLRendering.js >> $@
	$(CAT) vs_ui_GLConstraint.js >> $@
	$(CAT) vs_ui_GLColor.js >> $@
	$(CAT) vs_ui_GLStyle.js >> $@
	$(CAT) MainLoop.js >> $@
	$(CAT) vs_core_GLEventSource.js >> $@
	$(CAT) vs_ui_GLView.js >> $@
	$(CAT) vs_ui_GLApplication.js >> $@
	$(CAT) vs_ui_GLText.js >> $@
	$(CAT) vs_ui_GLButton.js >> $@
	$(CAT) vs_ui_GLImage.js >> $@
	$(CAT) vs_ui_GLCanvas.js >> $@
	$(CAT) vs_ui_GLScrollView.js >> $@
	$(CAT) vs_ui_GLAbstractList.js >> $@
	$(CAT) vs_ui_GLTemplate.js >> $@
	$(CAT) vs_ui_GLList.js >> $@
	$(CAT) vs_fx_GLAnimation.js >> $@
	$(CAT) vs_events.js >> $@
	$(CAT) vs_webcomponent.js >> $@