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

release :: clean vs_gl_engine.js
	-$(MV) vs_gl_engine.js vs_gl_engine_tmp.js
	-$(COMPILE) --js=vs_gl_engine_tmp.js --js_output_file=vs_gl_engine.js
	-$(RM_F) vs_gl_engine_tmp.js

debug :: clean vs_gl_engine.js

clean ::
	-$(RM_RF) vs_gl_engine.js

vs_webcomponent.js:
	$(CAT) customElement/polymer/Scope.js >> $@
	$(CAT) customElement/polymer/Boot.js >> $@
	$(CAT) customElement/polymer/Observer.js >> $@
	$(CAT) customElement/polymer/Parser.js >> $@
	$(CAT) customElement/polymer/CustomElements.js >> $@
	$(CAT) customElement/CustomElement.js >> $@

vs_event.js:
	$(CAT) core/event/MainLoop.js >> $@
	$(CAT) core/event/vs_core_GLEventSource.js >> $@
	$(CAT) core/event/GLPicking.js >> $@
	$(CAT) core/event/GLPointerEvent.js >> $@
	$(CAT) core/event/MouseEvent.js >> $@
	$(CAT) core/event/TouchEvent.js >> $@
	$(CAT) core/event/PointerEvent.js >> $@
	$(CAT) core/event/recognizer/DragRecognizer.js >> $@
	$(CAT) core/event/recognizer/PinchRecognizer.js >> $@
	$(CAT) core/event/recognizer/RotationRecognizer.js >> $@
	$(CAT) core/event/recognizer/TapRecognizer.js >> $@
	
vs_core.js:
	$(CAT) core/glMatrix.js >> $@
	$(CAT) core/webGLRendering.js >> $@
	$(CAT) core/vs_ui_GLConstraint.js >> $@
	$(CAT) core/vs_ui_GLColor.js >> $@
	$(CAT) core/vs_ui_GLStyle.js >> $@
	$(CAT) core/vs_ui_GLView.js >> $@
	$(CAT) core/vs_ui_GLScrollView.js >> $@
	$(CAT) core/vs_ui_GLApplication.js >> $@
	$(CAT) core/vs_ui_GLText.js >> $@
	$(CAT) core/vs_ui_GLImage.js >> $@
	
vs_gl_widget.js:
	$(CAT) widget/vs_ui_GLButton.js >> $@
	$(CAT) widget/vs_ui_GLAbstractList.js >> $@
	$(CAT) widget/vs_ui_GLTemplate.js >> $@
	$(CAT) widget/vs_ui_GLList.js >> $@
	
vs_gl_animation.js:
	$(CAT) animation/vs_fx_GLAnimation.js >> $@
	
vs_gl_engine.js: vs_core.js vs_event.js vs_gl_animation.js vs_gl_widget.js vs_webcomponent.js
	$(CAT) vs_event.js >> $@
	$(CAT) vs_core.js >> $@
	$(CAT) vs_gl_animation.js >> $@
	$(CAT) vs_gl_widget.js >> $@
	$(CAT) vs_webcomponent.js >> $@
	-$(RM_RF) vs_core.js
	-$(RM_RF) vs_event.js
	-$(RM_RF) vs_gl_animation.js
	-$(RM_RF) vs_gl_widget.js
	-$(RM_RF) vs_webcomponent.js
